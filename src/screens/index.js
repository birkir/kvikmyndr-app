import { Platform } from 'react-native';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';
import DrawerScreen from './drawer';
import InTheatersScreen from './in-theaters';
import InTheatersToolbar from './in-theaters/components/toolbar';
import AccountScreen from './account';
import ComingSoonScreen from './coming-soon';
import MovieScreen from './movie';
import PosterScreen from './poster';
import FilterScreen from './filter';
import FilterSortbyScreen from './filter-sortby';
import { COLOR } from '../theme';

const isIOS = Platform.OS === 'ios';

export const Screens = new Map();
export const Presets = new Map();

export const DRAWER_SCREEN = 'biohusid.DrawerScreen';
export const IN_THEATERS_SCREEN = 'biohusid.InTheatersScreen';
export const IN_THEATERS_TOOLBAR = 'biohusid.InTheatersToolbar';
export const ACCOUNT_SCREEN = 'biohusid.AccountScreen';
export const COMING_SOON_SCREEN = 'biohusid.ComingSoonScreen';
export const MOVIE_SCREEN = 'biohusid.MovieScreen';
export const POSTER_SCREEN = 'biohusid.PosterScreen';
export const FILTER_SCREEN = 'biohusid.FilterScreen';
export const FILTER_SORTBY_SCREEN = 'biohusid.FilterSortbyScreen';

Screens.set(DRAWER_SCREEN, () => DrawerScreen);
Screens.set(IN_THEATERS_SCREEN, () => InTheatersScreen);
Screens.set(IN_THEATERS_TOOLBAR, () => InTheatersToolbar);
Screens.set(ACCOUNT_SCREEN, () => AccountScreen);
Screens.set(COMING_SOON_SCREEN, () => ComingSoonScreen);
Screens.set(MOVIE_SCREEN, () => MovieScreen);
Screens.set(POSTER_SCREEN, () => PosterScreen);
Screens.set(FILTER_SCREEN, () => FilterScreen);
Screens.set(FILTER_SORTBY_SCREEN, () => FilterSortbyScreen);

const navigatorButtons = {
  leftButtons: Platform.select({
    android: [{
      id: 'sideMenu',
    }],
  }),
};

const navigatorStyle = {
  navBarButtonColor: COLOR.text,
  navBarBackgroundColor: COLOR.toolbarBackground,
  navBarTextColor: COLOR.text,
  selectedTopTabIndicatorColor: COLOR.primary,
  selectedTopTabIndicatorHeight: 4,
  selectedTopTabTextColor: COLOR.text,
  topTabTextColor: COLOR.text,
  navBarHideOnScroll: true,
  screenBackgroundColor: COLOR.screenBackground,
  statusBarColor: COLOR.statusBar,
};

const defaults = {
  navigatorStyle,
  navigatorButtons,
};

const date = new Date();
const tabs = Array.from({ length: 5 })
  .map((n, index) => format(addDays(date, index), 'ddd'));

Presets.set(IN_THEATERS_SCREEN, {
  navigatorStyle,
  navigatorButtons: {
    ...navigatorButtons,
    rightButtons: [{
      id: 'filter',
      icon: require('../images/icons/filter-filled.png'),
    }],
  },
  navBarCustomView: IN_THEATERS_TOOLBAR,
  screen: IN_THEATERS_SCREEN,
  title: 'In Theaters',
  topTabs: tabs.map((title, daysFromNow) => ({
    screenId: IN_THEATERS_SCREEN,
    title,
    passProps: { daysFromNow },
  })),
});

Presets.set(COMING_SOON_SCREEN, {
  navigatorStyle: {
    ...navigatorStyle,
    navBarHideOnScroll: false,
  },
  navigatorButtons,
  screen: COMING_SOON_SCREEN,
  title: 'Coming Soon',
});

Presets.set(ACCOUNT_SCREEN, {
  ...defaults,
  screen: ACCOUNT_SCREEN,
  title: 'Account',
});

Presets.set(MOVIE_SCREEN, {
  screen: MOVIE_SCREEN,
  backButtonTitle: '',
  navigatorStyle: {
    ...navigatorStyle,
    navBarHideOnScroll: false,
    drawUnderNavBar: true,
    drawUnderTabBar: true,
    navBarHidden: isIOS,
    navBarTransparent: true,
  },
});

Presets.set(POSTER_SCREEN, {
  screen: POSTER_SCREEN,
});
