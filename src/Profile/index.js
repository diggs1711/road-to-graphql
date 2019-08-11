import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loading from '../Loading';
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';
import ErrorMessage from '../Error';

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
	{
		viewer {
			login
			name
			repositories(first: 5, orderBy: { direction: DESC, field: STARGAZERS }) {
				edges {
					node {
						...repository
					}
				}
			}
		}
	}

    ${REPOSITORY_FRAGMENT}
`;

const Profile = () => {
	const { loading, data, error } = useQuery(GET_REPOSITORIES_OF_CURRENT_USER);
	if (error) return <ErrorMessage error={error} />;

	const { viewer } = data;
	if (loading || !viewer) return <Loading />;

	return <RepositoryList repository={viewer.repositories} />;
};

export default Profile;
