import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Auth0 from 'react-native-auth0';
import config from 'react-native-config';
import { Group, Item } from '../../components/settings';
import UI from '../../store/UI';

const auth0 = new Auth0({
  domain: config.AUTH0_DOMAIN,
  clientId: config.AUTH0_CLIENT_ID,
});

@inject('ui')
@observer
export default class Account extends Component {

  static propTypes = {
    ui: PropTypes.object.isRequired,
  }

  onAuthPress = () => {
    auth0
      .webAuth
      .authorize({
        scope: 'openid email',
        audience: `https://${config.AUTH0_DOMAIN}/userinfo`,
      })
      .then(credentials => console.log(credentials))
      .catch(error => console.log(error));
  }

  render() {

    const items = [{
      label: 'Grid',
      value: UI.Layout.GRID,
    }, {
      label: 'List',
      value: UI.Layout.LIST,
    }];

    const selected = this.props.ui.settings.movieCardLayout;

    return (
      <View style={styles.host}>
        <Group legend="Settings">
          {items.map(({ label, value }) => (
            <Item
              key={label}
              label={label}
              isSelected={selected === value}
              onPress={() => { this.props.ui.settings.movieCardLayout = value; }}
            />
          ))}
        </Group>
        <TouchableOpacity onPress={this.onAuthPress}>
          <Text>AUTH!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
