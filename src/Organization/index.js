import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';
import ErrorMessage from '../Error';
import Loading from '../Loading';

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
    query($organizationName: String!, $cursor: String) {
        organization(login: $organizationName) {
            repositories(first: 5, after: $cursor) {
                edges {
                    node {
                        ...repository
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
    ${REPOSITORY_FRAGMENT}
`;

const Organization = ({ name }) => {
	const { loading, data, error, fetchMore } = useQuery(GET_REPOSITORIES_OF_ORGANIZATION, {
		variables: {
			organizationName: name
		},
		skip: !name || name.length === 0,
		notifyOnNetworkStatusChange: true
	});

	if (error) return <ErrorMessage error={error} />;
	const { organization } = data;

	if (loading && !organization) return <Loading />;

	return (
		<RepositoryList
			loading={loading}
			repositories={organization.repositories}
			fetchMore={fetchMore}
			entry={'organization'}
		/>
	);
};

export default Organization;
