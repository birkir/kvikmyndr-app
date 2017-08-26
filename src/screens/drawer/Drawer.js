import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { autobind } from 'core-decorators';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { Presets, IN_THEATERS_SCREEN, COMING_SOON_SCREEN, ACCOUNT_SCREEN } from '../../screens';
import MenuItem from './components/menu-item';
import Header from './components/header';

@observer
export default class Drawer extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  @autobind
  onMenuItemPress({ screen }) {
    const config = cloneDeep(Presets.get(screen));
    set(config, 'animated', false);
    this.props.navigator.resetTo(config);
    this.close();
    this.active = screen;
  }

  @autobind
  close() {
    this.props.navigator.toggleDrawer({
      side: 'left',
      animated: true,
      to: 'closed',
    });
  }

  @observable
  active = IN_THEATERS_SCREEN;

  render() {
    return (
      <View style={styles.host}>
        <Header onPress={this.close} />
        <MenuItem
          title="In Theaters"
          screen={IN_THEATERS_SCREEN}
          onPress={this.onMenuItemPress}
          icon={require('../../images/icons/movie.png')}
          isActive={this.active === IN_THEATERS_SCREEN}
        />
        <MenuItem
          title="Coming Soon"
          screen={COMING_SOON_SCREEN}
          icon={require('../../images/icons/calendar.png')}
          onPress={this.onMenuItemPress}
          isActive={this.active === COMING_SOON_SCREEN}
        />
        <MenuItem
          title="Account"
          screen={ACCOUNT_SCREEN}
          icon={require('../../images/icons/user.png')}
          onPress={this.onMenuItemPress}
          isActive={this.active === ACCOUNT_SCREEN}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  host: {
    height: '100%',
    width: 300,
    backgroundColor: '#000',
  },

});
