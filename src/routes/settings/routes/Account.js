import React, { Component } from 'react';
import { AppState, ActionSheetIOS, View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react/native';
import List, { Group, Item } from 'components/list';
import store from 'store';

@observer
export default class SettingsAccount extends Component {

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  onAppStateChange() {
    // Check saved accounts
    store.user.savedAccounts();
  }

  onPress(provider) {
    const isAuthorized = store.user.providers.find(item => item.provider === provider);
    if (isAuthorized) {
      const options = [store.UI.i18n.UNLINK_ACCOUNT, store.UI.i18n.CANCEL];
      ActionSheetIOS.showActionSheetWithOptions({
        options,
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      }, (i) => {
        if (i === 0) {
          store.user.deauthorize(provider);
        }
      });
    } else {
      store.user.authorize(provider);
    }
  }

  providers = [{
    icon: 'facebook',
    label: 'Facebook',
    name: 'facebook',
  }, {
    icon: 'google-',
    label: 'Google',
    name: 'google',
  }, {
    icon: 'github',
    label: 'GitHub',
    name: 'github',
  }];

  render() {
    const { isAuthenticated, user } = store.user;

    const {
      LINKED_PROVIDERS,
      SELECT_PROVIDER,
      SIGN_OUT,
      USER_INFORMATION,
    } = store.UI.i18n;

    return (
      <View style={s.host}>
        <List>
          {isAuthenticated && (
            <Group label={USER_INFORMATION}>
              <Item label={user.displayName} />
              <Item label={user.email} />
            </Group>
          )}
          <Group label={isAuthenticated ? LINKED_PROVIDERS : SELECT_PROVIDER}>
            {this.providers.map(({ icon, label, name }) => (
              <Item
                key={name}
                icon={icon}
                label={label}
                onPress={() => this.onPress(name)}
              >
                {store.user.providers.find(provider => provider.provider === name)
                  ? <Text style={s.check}>✓</Text>
                  : null
                }
              </Item>
            ))}
          </Group>
          {isAuthenticated && (<Group label=" ">
            <Item label={SIGN_OUT} onPress={store.user.signOut} />
          </Group>)}
        </List>
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: 64,
  },

  check: {
    fontSize: 17,
    color: '#fff',
  },

  photo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
