import React, { Component } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { Actions } from 'react-native-mobx';
import { observer } from 'mobx-react/native';
import List, { Group, Item } from 'components/list';
import ListItemUpdateVersion from 'components/list-item-update-version';
import store from 'store';
import _get from 'lodash/get';

@observer
export default class Settings extends Component {

  onShowSynopsisChange(value) {
    store.UI.showSynopsis = value;
  }

  render() {
    const { isAuthenticated, user } = store.user;

    const {
      SETTINGS_GROUP_PERSONALIZATION,
      SETTINGS_GROUP_UI,
      SETTINGS_GROUP_APP,
      LANGUAGE,
      THEATERS,
      SHOW_SYNOPSIS,
      LOGGED_IN_AS,
      ORDER_BY,
      SIGN_IN,
      ABOUT,
    } = store.UI.i18n;

    return (
      <View style={s.host}>
        <List>
          <Group label={SETTINGS_GROUP_PERSONALIZATION}>
            <Item
              label={isAuthenticated ? LOGGED_IN_AS(_get(user, 'displayName', '')) : SIGN_IN}
              onPress={Actions.SETTINGS_ACCOUNT}
            />
          </Group>
          <Group label={SETTINGS_GROUP_UI}>
            <Item
              label={LANGUAGE}
              value={store.UI.labelLanguage}
              onPress={Actions.SETTINGS_LANGUAGE}
            />
            <Item
              label={THEATERS}
              value={store.UI.labelTheaters}
              onPress={Actions.SETTINGS_THEATERS}
            />
            <Item label={SHOW_SYNOPSIS}>
              <Switch
                onValueChange={this.onShowSynopsisChange}
                value={store.UI.showSynopsis}
                onTintColor="#777"
                thumbTintColor="#454545"
                tintColor="#333"
              />
            </Item>
            <Item
              label={ORDER_BY}
              value={store.UI.labelOrderBy}
              onPress={Actions.SETTINGS_ORDER_BY}
            />
          </Group>
          <Group label={SETTINGS_GROUP_APP}>
            <ListItemUpdateVersion />
            <Item label={ABOUT} />
          </Group>
        </List>
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    flex: 1,
    marginTop: 64,
    backgroundColor: '#000',
  },
});
