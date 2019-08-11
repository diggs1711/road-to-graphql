import React from 'react';
import '../style.css';
import RepositoryItem from '../RepositoryItem';

const RepositoryList = ({ repository }) =>
	repository.edges.map(({ node }) => (
		<div key={node.id} className="RepositoryItem">
			<RepositoryItem {...node} />
		</div>
	));

export default RepositoryList;
