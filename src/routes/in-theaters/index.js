import React from 'react';
import MenuButton from 'components/menu-button';
import store from 'store';
import InTheaters from './InTheaters';
import SettingsButton from './components/SettingsButton';

export default {
  component: InTheaters,
  renderLeftButton: () => <MenuButton />,
  renderRightButton: () => <SettingsButton />,
  title: () => store.UI.i18n.ROUTE_IN_THEATERS,
};
