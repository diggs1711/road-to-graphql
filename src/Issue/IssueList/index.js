import React, { useState, Fragment } from 'react';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from 'react-apollo';
import ErrorMessage from '../../Error';
import Loading from '../../Loading';
import IssueItem from '../IssueItem';
import Button, { ButtonUnobtrusive } from '../../Button';
import FetchMore from '../../FetchMore';

const ISSUE_STATES = {
	NONE: 'NONE',
	OPEN: 'OPEN',
	CLOSED: 'CLOSED'
};

const TRANSITION_LABELS = {
	[ISSUE_STATES.NONE]: 'Show open issues',
	[ISSUE_STATES.OPEN]: 'Show closed issues',
	[ISSUE_STATES.CLOSED]: 'Hide issues'
};

const TRANSITION_STATE = {
	[ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
	[ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
	[ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE
};

const isShow = (issueState) => issueState !== ISSUE_STATES.NONE;

const GET_ISSUES_OF_REPOSITORY = gql`
	query(
		$repositoryOwner: String!
		$repositoryName: String!
		$issueState: IssueState!
		$cursor: String
	) {
		repository(name: $repositoryName, owner: $repositoryOwner) {
			issues(first: 5, states: [$issueState], after: $cursor) {
				edges {
					node {
						id
						number
						state
						title
						url
						bodyHTML
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	}
`;

const Issues = ({ repositoryName, repositoryOwner }) => {
	const [ issueState, setIssueState ] = useState(ISSUE_STATES.NONE);

	const handleIssueStateChange = (nextIssueState) => setIssueState(nextIssueState);

	return (
		<div className="Issues">
			<IssueFilter
				repositoryName={repositoryName}
				repositoryOwner={repositoryOwner}
				issueState={issueState}
				handleIssueStateChange={handleIssueStateChange}
			/>
			{isShow(issueState) && (
				<IssuesRes
					repositoryName={repositoryName}
					repositoryOwner={repositoryOwner}
					issueState={issueState}
				/>
			)}
		</div>
	);
};

const prefetchIssues = (client, repositoryName, repositoryOwner, issueState) => {
	const nextIssueState = TRANSITION_STATE[issueState];

	client.query({
		query: GET_ISSUES_OF_REPOSITORY,
		variables: {
			repositoryName,
			repositoryOwner,
			issueState: nextIssueState
		}
	});
};

const IssueFilter = ({ repositoryName, repositoryOwner, issueState, handleIssueStateChange }) => {
	const client = useApolloClient();

	return (
		<ButtonUnobtrusive
			onClick={() => handleIssueStateChange(TRANSITION_STATE[issueState])}
			onMouseOver={() => prefetchIssues(client, repositoryName, repositoryOwner, issueState)}
		>
			{TRANSITION_LABELS[issueState]}
		</ButtonUnobtrusive>
	);
};

const IssuesRes = ({ repositoryName, repositoryOwner, issueState }) => {
	const { error, data, loading, fetchMore } = useQuery(GET_ISSUES_OF_REPOSITORY, {
		variables: {
			repositoryName,
			repositoryOwner,
			issueState
		},
		notifyOnNetworkStatusChange: true
	});

	if (error) return <ErrorMessage error={error} />;

	const { repository } = data;

	if (loading && !repository) return <Loading />;

	if (!repository.issues.edges.length) {
		return <div className="IssueList">No issues...</div>;
	}

	return (
		<Fragment>
			<IssueList issues={repository.issues} />;
			<FetchMore
				variables={{
					repositoryName,
					repositoryOwner,
					issueState,
					cursor: repository.issues.pageInfo.endCursor
				}}
				fetchMore={fetchMore}
				hasNextPage={repository.issues.pageInfo.hasNextPage}
				loading={loading}
				updateQuery={getUpdateQuery}
			/>
		</Fragment>
	);
};

const getUpdateQuery = (previousResult, { fetchMoreResult }) => {
	if (!fetchMoreResult) return previousResult;

	return {
		...previousResult,
		repository: {
			...previousResult.repository,
			issues: {
				...previousResult.repository.issues,
				...fetchMoreResult.repository.issues,
				edges: [
					...previousResult.repository.issues.edges,
					...fetchMoreResult.repository.issues.edges
				]
			}
		}
	};
};

const IssueList = ({ issues }) => (
	<div className="IssueList">
		{issues.edges.map(({ node }) => <IssueItem key={node.id} issue={node} />)}
	</div>
);

export default Issues;
