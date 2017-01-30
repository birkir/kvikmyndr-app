import React from 'react';
import MenuButton from 'components/menu-button';
import store from 'store';
import Movie from './Movie';

export default {
  component: Movie,
  renderLeftButton: () => <MenuButton />,
  title: () => store.UI.i18n.ROUTE_MOVIE,
  hideNavBar: true,
};
