import React from 'react';
import Link from '../../Link';
import '../style.css';
import { useMutation } from 'react-apollo';
import Button from '../../Button';

import { STAR_REPO, REMOVE_STAR, UPDATE_SUBSCRIPTION } from '../mutations';
import { REPOSITORY_FRAGMENT } from '..';

const RepositoryItem = ({
	id,
	name,
	url,
	descriptionHTML,
	primaryLanguage,
	owner,
	stargazers,
	watchers,
	viewerSubscription,
	viewerHasStarred
}) => {
	const [
		addStar,
		{ data: addStarData, loading: addStarLoading, error: addStarError }
	] = useMutation(STAR_REPO, {
		update(cache) {
			const repository = cache.readFragment({
				id: `Repository:${id}`,
				fragment: REPOSITORY_FRAGMENT
			});

			const totalCount = repository.stargazers.totalCount + 1;

			cache.writeFragment({
				id: `Repository:${id}`,
				fragment: REPOSITORY_FRAGMENT,
				data: {
					...repository,
					stargazers: {
						...repository.stargazers,
						totalCount
					}
				}
			});
		}
	});
	const [
		removeStar,
		{ data: removeStarData, loading: removeStarLoading, error: removeStarError }
	] = useMutation(REMOVE_STAR, {
		update(cache) {
			const repository = cache.readFragment({
				id: `Repository:${id}`,
				fragment: REPOSITORY_FRAGMENT
			});

			const totalCount = repository.stargazers.totalCount - 1;

			cache.writeFragment({
				id: `Repository:${id}`,
				fragment: REPOSITORY_FRAGMENT,
				data: {
					...repository,
					stargazers: {
						...repository.stargazers,
						totalCount
					}
				}
			});
		}
	});

	const [
		updateSubscription,
		{ data: subscriptionData, loading: subscriptionLoading, error: subscriptionError }
	] = useMutation(UPDATE_SUBSCRIPTION, {
		update(cache) {
			const repository = cache.readFragment({
				id: `Repository:${id}`,
				fragment: REPOSITORY_FRAGMENT
			});
			console.log(cache);

			const totalCount =
				viewerSubscription === 'UNSUBSCRIBED'
					? repository.watchers.totalCount + 1
					: repository.watchers.totalCount - 1;

			cache.writeFragment({
				id: `Repository:${id}`,
				fragment: REPOSITORY_FRAGMENT,
				data: {
					...repository,
					watchers: {
						...repository.watchers,
						totalCount
					}
				}
			});
		}
	});

	// const updateStar = ()
	return (
		<div>
			<div className="RepositoryItem-title">
				<h2>
					<Link href={url}>{name}</Link>
				</h2>
				<div>
					{!viewerHasStarred ? (
						<Button
							className="RepositoryItem-title-action"
							onClick={() =>
								addStar({
									variables: {
										repoId: id
									}
								})}
						>
							{stargazers.totalCount} Star
						</Button>
					) : (
						<Button
							className="RepositoryItem-title-action"
							onClick={() =>
								removeStar({
									variables: {
										id: id
									}
								})}
						>
							{stargazers.totalCount} unstar
						</Button>
					)}
					<Button
						className="RepositoryItem-title-action"
						onClick={() =>
							updateSubscription({
								variables: {
									id: id,
									nextState:
										viewerSubscription === 'UNSUBSCRIBED'
											? 'SUBSCRIBED'
											: 'UNSUBSCRIBED'
								}
							})}
					>
						{watchers.totalCount}{' '}
						{viewerSubscription === 'UNSUBSCRIBED' ? 'watch' : 'unwatch'}
					</Button>
				</div>
			</div>

			<div className="RepositoryItem-description">
				<div
					className="RepositoryItem-description-info"
					dangerouslySetInnerHTML={{ __html: descriptionHTML }}
				/>
				<div className="RepositoryItem-description-details">
					<div>{primaryLanguage && <span>Language: {primaryLanguage.name}</span>}</div>
					<div>
						{owner && (
							<span>
								Owner: <Link href={owner.url}>{owner.login}</Link>
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RepositoryItem;
