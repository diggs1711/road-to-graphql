import React, { Fragment } from 'react';
import '../style.css';
import RepositoryItem from '../RepositoryItem';
import FetchMore from '../../FetchMore';
import Issues from '../../Issue';

const getUpdateQuery = (entry) => (previousResult, { fetchMoreResult }) => {
	if (!fetchMoreResult) return previousResult;
	return {
		...previousResult,
		[entry]: {
			...previousResult[entry],
			repositories: {
				...previousResult[entry].repositories,
				...fetchMoreResult[entry].repositories,
				edges: [
					...previousResult[entry].repositories.edges,
					...fetchMoreResult[entry].repositories.edges
				]
			}
		}
	};
};

const RepositoryList = ({ repositories, entry, fetchMore, loading }) => (
	<Fragment>
		{repositories.edges.map(({ node }) => (
			<div key={node.id} className="RepositoryItem">
				<RepositoryItem {...node} />
				<Issues repositoryName={node.name} repositoryOwner={node.owner.login} />
			</div>
		))}
		<FetchMore
			loading={loading}
			fetchMore={fetchMore}
			hasNextPage={repositories.pageInfo.hasNextPage}
			variables={{ cursor: repositories.pageInfo.endCursor }}
			updateQuery={getUpdateQuery(entry)}
		>
			Repositories
		</FetchMore>
	</Fragment>
);

export default RepositoryList;
