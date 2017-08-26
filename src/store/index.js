import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { Provider } from 'mobx-react/native';
import { ApolloProvider, ApolloClient, createNetworkInterface, toIdValue } from 'react-apollo';
import { create, persist } from 'mobx-persist';
import config from 'react-native-config';
import throttle from 'lodash/throttle';
import UI from './UI';

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

const networkInterface = createNetworkInterface({
  uri: config.GRAPHQL_ENDPOINT,
});

export default class Store {

  @persist('object', UI)
  ui = new UI();

  async setup() {
    let initialState = {};

    try {
      const data = await AsyncStorage.getItem('@Apollo');
      initialState = JSON.parse(data);
    } catch (err) {
      console.log('Failed fetching apollo initialState', err);
    }

    // Create new Apollo client
    const client = new ApolloClient({
      networkInterface,
      initialState,
      dataIdFromObject: o => o.id,
      customResolvers: {
        Query: {
          Movie: (_, { id }) => toIdValue(this.client.dataIdFromObject({ __typename: 'Movie', id })),
        },
      },
    });

    // Persist the store after every network request
    networkInterface.useAfter([{
      applyAfterware(_, next) {
        setTimeout(throttle(() => {
          try {
            const state = client.store.getState();
            AsyncStorage.setItem('@Apollo', JSON.stringify(state));
          } catch (err) {
            console.log('Failed persisting store', err);
          }
        }, 1000), 1000);
        next();
      },
    }]);

    this.client = client;

    return hydrate('store', this);
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
      <Provider ui={store.ui} movies={store.movies}>
        <ApolloProvider client={store.client}>
          {children}
        </ApolloProvider>
      </Provider>
    );
  }
}
