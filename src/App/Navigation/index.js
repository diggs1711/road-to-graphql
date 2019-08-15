import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as routes from '../../constants/routes';

import './style.css';
import Input from '../../Input';
import Button from '../../Button';

const OrganizationSearch = ({ organizationName, onOrganizationSearch }) => {
	const [ name, setName ] = useState(organizationName);

	return (
		<div className="Navigation-search">
			<form onSubmit={(e) => onOrganizationSearch(e, name)}>
				<Input
					color={'white'}
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Button color={'white'} type="submit">
					Search
				</Button>
			</form>
		</div>
	);
};

const Navigation = ({ location: { pathname }, organizationName, onOrganizationSearch }) => {
	return (
		<header className="Navigation">
			<div className="Navigation-link">
				<Link to={routes.PROFILE}>Profile</Link>
			</div>
			<div className="Navigation-link">
				<Link to={routes.ORGANIZATION}>Organization</Link>
			</div>

			{pathname === routes.ORGANIZATION && (
				<OrganizationSearch
					organizationName={organizationName}
					onOrganizationSearch={onOrganizationSearch}
				/>
			)}
		</header>
	);
};

export default withRouter(Navigation);
