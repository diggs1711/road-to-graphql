import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_CURRENT_USER = gql`
	{
		viewer {
			login
			name
		}
	}
`;

const Profile = () => {
	const { loading, data, error } = useQuery(GET_CURRENT_USER);
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	const { viewer } = data;

	return (
		<div>
			{viewer.name} {viewer.login}
		</div>
	);
};

export default Profile;
