import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://api.graph.cool/simple/v1/cj65psnfa0oqd0187a705fd4h',
  fetchOptions: {
    credentials: 'include'
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) return console.error('GrahQL Errors:', graphQLErrors);
    if (networkError) return console.error('Network Error: ', networkError);
  },
});

export { client, gql };
