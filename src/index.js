import React, { Component } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Router } from 'react-native-mobx';
import { observer } from 'mobx-react/native';
import store from 'store';
import routes from 'routes';
import codePush from 'react-native-code-push';
import env from 'utils/env';

@codePush(env.codePush)
@observer
export default class Biohusid extends Component {
  render() {
    return (
      <View style={s.host}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        {!store.isLoading && (
          <Router
            store={store}
            dispatch={store.UI.dispatch}
            sceneStyle={s.scene}
            navigationBarStyle={s.navigation}
            titleStyle={s.title}
          >
            {routes(store)}
          </Router>
        )}
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    backgroundColor: '#000',
    flex: 1,
  },

  scene: {
    backgroundColor: '#000',
    marginTop: 0,
  },

  title: {
    fontSize: 20,
    color: '#fff',
  },

  navigation: {
    backgroundColor: '#000',
    borderBottomWidth: 0,
  },
});
