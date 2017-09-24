import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Screens, Presets, DRAWER_SCREEN, IN_THEATERS_SCREEN, IN_THEATERS_TOOLBAR, COMING_SOON_SCREEN, ACCOUNT_SCREEN } from './screens';
import Store, { StoreProvider } from './store';

const store = new Store();

Array.from(Screens.entries())
  .forEach(([screenConst, screenModule]) =>
    Navigation.registerComponent(screenConst, screenModule, store, StoreProvider));

store.setup().then(() => {

  if (Platform.OS === 'android') {
    Navigation.startSingleScreenApp({
      screen: Presets.get(IN_THEATERS_SCREEN),
      drawer: { left: { screen: DRAWER_SCREEN } },
      animationType: 'fade',
    });
  }

  if (Platform.OS === 'ios') {
    const navigatorStyle = {
      navBarButtonColor: '#FFF',
      navBarTextColor: '#FFF',
      navBarHideOnScroll: false,
      navBarTranslucent: true,
      navBarNoBorder: true,

      topTabTextColor: '#FFF',
      selectedTopTabIndicatorColor: '#FF2244',
      selectedTopTabIndicatorHeight: 4,
      selectedTopTabTextColor: '#FFF',

      drawUnderTabBar: true,
      drawUnderNavBar: true,

      statusBarTextColorScheme: 'light',
      screenBackgroundColor: '#171717',
    };

    Navigation.startTabBasedApp({
      tabs: [{
        label: 'In Theaters',
        screen: IN_THEATERS_SCREEN,
        icon: require('./images/icons/movie.png'),
        selectedIcon: require('./images/icons/movie-filled.png'),
        navigatorStyle: {
          ...navigatorStyle,
          navBarCustomView: IN_THEATERS_TOOLBAR,
        },
        navigatorButtons: {
          rightButtons: [{
            title: 'Filter',
            id: 'filter',
          }],
        },
      }, {
        label: 'Coming Soon',
        screen: COMING_SOON_SCREEN,
        icon: require('./images/icons/calendar.png'),
        selectedIcon: require('./images/icons/calendar-filled.png'),
        navigatorStyle: {
          ...navigatorStyle,
          navBarHidden: true,
        },
      }, {
        label: 'Account',
        screen: ACCOUNT_SCREEN,
        icon: require('./images/icons/user.png'),
        selectedIcon: require('./images/icons/user-filled.png'),
        navigatorStyle,
      }],
      tabsStyle: {
        tabBarTranslucent: true,
        tabBarButtonColor: '#B0B0B0',
        tabBarSelectedButtonColor: '#FF2244',
        tabBarBackgroundColor: 'rgba(0, 0, 0, 0.25)',
        tabBarBlur: 'dark',
        tabBarHideShadow: true,
      },
      appStyle: {
      },
    });
  }
});
