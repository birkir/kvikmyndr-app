import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { DefaultRenderer } from 'react-native-mobx';
import { observer } from 'mobx-react/native';
import { isTablet } from 'utils/device';
import Drawer from 'react-native-drawer';
import store from 'store';
import renderObserved from 'utils/render-observed';
import MenuItem from './MenuItem';

@observer
export default class NavigationDrawer extends Component {

  static propTypes = {
    navigationState: PropTypes.object, // eslint-disable-line
    onNavigate: PropTypes.func, // eslint-disable-line
  };

  onDrawerClose() {
    store.UI.isDrawerOpen = false;
  }

  renderContent() {
    return (
      <View style={s.menu}>
        <MenuItem title={store.UI.i18n.MENU_ITEM_IN_THEATERS} to="IN_THEATERS" />
        <MenuItem title={store.UI.i18n.MENU_ITEM_COMING_SOON} to="COMING_SOON" />
        <MenuItem title={store.UI.i18n.MENU_ITEM_SETTINGS} to="SETTINGS" />
      </View>
    );
  }

  render() {
    const { navigationState, onNavigate } = this.props;
    const { children } = navigationState;

    if (isTablet()) {
      return (
        <Drawer
          open
          type="overlay"
          content={renderObserved(this.renderContent)}
          openDrawerOffset={viewport => viewport.width - 260}
          acceptPan={false}
          captureGestures={false}
          styles={{ main: { paddingLeft: 260 } }}
        >
          <DefaultRenderer
            navigationState={children[0]}
            onNavigate={onNavigate}
          />
        </Drawer>
      );
    }

    return (
      <Drawer
        open={store.UI.isDrawerOpen}
        type="static"
        onClose={this.onDrawerClose}
        content={renderObserved(this.renderContent)}
        openDrawerOffset={viewport => viewport.width - 260}
        panOpenMask={0.1}
        tapToClose
      >
        <DefaultRenderer
          navigationState={children[0]}
          onNavigate={onNavigate}
        />
      </Drawer>
    );
  }
}

const s = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: '#1d1d1d',
    paddingTop: 22,
  },
});
