import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import './index.css';
import App from './App/index';
import * as serviceWorker from './serviceWorker';
import { ApolloLink } from 'apollo-link';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
	uri: GITHUB_BASE_URL,
	headers: {
		Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
	}
});

const cache = new InMemoryCache();
const retryLink = new RetryLink();
const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.map(({ message, locations, path }) =>
			console.log(
				`[GraphQL Error]: Message:${message}, Location: ${locations}, Path: ${path}`
			)
		);
	}

	if (networkError) {
		console.log(`[Network Error]: ${networkError}`);
	}
});

const link = ApolloLink.from([ errorLink, httpLink, retryLink ]);

const client = new ApolloClient({
	link,
	cache
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
