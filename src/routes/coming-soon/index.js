import React from 'react';
import MenuButton from 'components/menu-button';
import store from 'store';
import ComingSoon from './ComingSoon';

export default {
  component: ComingSoon,
  renderLeftButton: () => <MenuButton />,
  title: () => store.UI.i18n.ROUTE_COMING_SOON,
};
