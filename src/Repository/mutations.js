import gql from 'graphql-tag';

export const STAR_REPO = gql`
	mutation($repoId: ID!) {
		addStar(input: { starrableId: $repoId }) {
			starrable {
				id
				viewerHasStarred
			}
		}
	}
`;

export const REMOVE_STAR = gql`
	mutation($id: ID!) {
		removeStar(input: { starrableId: $id }) {
			starrable {
				id
				viewerHasStarred
			}
		}
	}
`;

export const UPDATE_SUBSCRIPTION = gql`
	mutation($id: ID!, $nextState: SubscriptionState!) {
		updateSubscription(input: { subscribableId: $id, state: $nextState }) {
			subscribable {
				id
				viewerSubscription
			}
		}
	}
`;
