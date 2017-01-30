import React from 'react';
import MenuButton from 'components/menu-button';
import BackButton from 'components/back-button';
import store from 'store';
import Settings from './Settings';

const childs = {
  renderBackButton: () => <BackButton isNavbar />,
  duration: 0,
};

export const SettingsAccount = {
  component: require('./routes/Account').default, // eslint-disable-line
  ...childs,
  title: () => store.UI.i18n.ROUTE_ACCOUNT,
};

export const SettingsLanguage = {
  component: require('./routes/Language').default, // eslint-disable-line
  ...childs,
  title: () => store.UI.i18n.ROUTE_LANGUAGE,
};

export const SettingsTheaters = {
  component: require('./routes/Theaters').default, // eslint-disable-line
  ...childs,
  title: () => store.UI.i18n.ROUTE_THEATERS,
};

export const SettingsOrderBy = {
  component: require('./routes/OrderBy').default, // eslint-disable-line
  ...childs,
  title: () => store.UI.i18n.ROUTE_ORDER_BY,
};

export default {
  component: Settings,
  renderLeftButton: () => <MenuButton />,
  duration: 0,
  title: () => store.UI.i18n.ROUTE_SETTINGS,
};
