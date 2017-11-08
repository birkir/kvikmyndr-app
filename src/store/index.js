import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ApolloClient from 'apollo-client';
import Link from 'apollo-link-http';
import InMemoryCache from 'apollo-cache-inmemory';
import { Provider } from 'mobx-react/native';
import { ApolloProvider } from 'react-apollo';
import config from '../config';
import UI from './UI';
import Auth from './Auth';

if (__DEV__) { // eslint-disable-line
  const nativeXMLHttpRequest = XMLHttpRequest; // eslint-disable-line
  const devXMLHttpRequest = GLOBAL.originalXMLHttpRequest ? GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest; // eslint-disable-line
  GLOBAL.XMLHttpRequest = devXMLHttpRequest;
}

// Create new Apollo client
const link = new Link({
  uri: config.GRAPHQL_ENDPOINT,
});
const cache = new InMemoryCache();
const client = new ApolloClient({
  link,
  cache,
});


export default class Store {
  client = client;
  ui = new UI();
  auth = new Auth();
  
  async setup() {
    return true;
  }
}

export class StoreProvider extends PureComponent {

  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.node,
  };

  static defaultProps = {
    store: {},
    children: undefined,
  };

  render() {
    const { store, children } = this.props;
    return (
      <Provider ui={store.ui} auth={store.auth}>
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </Provider>
    );
  }
}
