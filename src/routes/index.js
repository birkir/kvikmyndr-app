import React from 'react';
import { Scene } from 'react-native-mobx';
import Drawer from 'components/drawer';
import InTheaters from './in-theaters';
import ComingSoon from './coming-soon';
import Settings, {
  SettingsLanguage,
  SettingsTheaters,
  SettingsOrderBy,
  SettingsAccount,
} from './settings';
import Movie from './movie';

export default store => (
  <Scene key="ROOT">
    <Scene key="DRAWER" component={Drawer} isDrawerOpen={store.UI.isDrawerOpen}>
      <Scene key="DRAWER_ROOT" hideTabBar>
        <Scene key="IN_THEATERS" initial {...InTheaters} />
        <Scene key="COMING_SOON" {...ComingSoon} />
        <Scene key="SETTINGS" {...Settings} />
        <Scene key="SETTINGS_ACCOUNT" {...SettingsAccount} />
        <Scene key="SETTINGS_LANGUAGE" {...SettingsLanguage} />
        <Scene key="SETTINGS_THEATERS" {...SettingsTheaters} />
        <Scene key="SETTINGS_ORDER_BY" {...SettingsOrderBy} />
        <Scene key="ABOUT" />
      </Scene>
    </Scene>
    <Scene key="MOVIE" {...Movie} />
  </Scene>
);
