import React, { Fragment } from 'react';
import Loading from '../Loading';
import './style.css';
import { ButtonUnobtrusive } from '../Button';

const FetchMore = ({ loading, fetchMore, children, hasNextPage, variables, updateQuery }) => {
	return (
		<div className="FetchMore">
			{loading ? (
				<Loading />
			) : (
				hasNextPage && (
					<ButtonUnobtrusive
						type="button"
						className="FetchMore-button"
						onClick={() =>
							fetchMore({
								variables,
								updateQuery
							})}
					> 
						More {children}
					</ButtonUnobtrusive>
				)
			)}
		</div>
	);
};

export default FetchMore;
