import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loading from '../Loading';
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';
import ErrorMessage from '../Error';

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
	query($cursor: String) {
		viewer {
			login
			name
			repositories(first: 5, after: $cursor, orderBy: { direction: DESC, field: STARGAZERS }) {
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

const Profile = () => {
	const { loading, data, error, fetchMore } = useQuery(GET_REPOSITORIES_OF_CURRENT_USER, {
		notifyOnNetworkStatusChange: true
	});

	if (error) return <ErrorMessage error={error} />;

	const { viewer } = data;
	if (loading && !viewer) return <Loading />;

	return (
		<RepositoryList
			entry={'viewer'}
			loading={loading}
			fetchMore={fetchMore}
			repositories={viewer.repositories}
		/>
	);
};

export default Profile;
