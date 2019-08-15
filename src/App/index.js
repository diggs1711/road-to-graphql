import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from '../logo.svg';
import './style.css';
import Profile from '../Profile';
import Organization from '../Organization';
import * as Routes from '../constants/routes';
import Navigation from './Navigation';

function App() {
	const [ organizationName, setOrganizationName ] = useState('the-road-to-learn-react');

	const onOrganizationSearch = (e, val) => {
		console.log(e, val);
		e.preventDefault();
		setOrganizationName(val);
	};

	return (
		<Router>
			<div className="App">
				<Navigation
					organizationName={organizationName}
					onOrganizationSearch={onOrganizationSearch}
				/>
				<div className="App-main">
					<Route
						exact
						path={Routes.ORGANIZATION}
						component={() => (
							<div className="App-content_large-header">
								<Organization name={organizationName} />
							</div>
						)}
					/>

					<Route
						exact
						path={Routes.PROFILE}
						component={() => (
							<div className="App-content_small-header">
								<Profile />
							</div>
						)}
					/>
				</div>
			</div>
		</Router>
	);
}

export default App;
