import { AsyncStorage } from 'react-native';
import { ApolloClient, InMemoryCache, HttpLink, gql } from 'apollo-boost';
import { persistCache } from 'apollo-cache-persist';

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: AsyncStorage,
  maxSize: 1024 * 1024 * 4,
});

const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'https://api.graph.cool/simple/v1/cj65psnfa0oqd0187a705fd4h',
    credentials: 'include',
  }),
});

export { client, cache, gql };
