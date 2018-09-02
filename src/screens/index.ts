import { Navigation } from 'react-native-navigation';
import { Platform } from 'react-native';

// Screens
import Week from './week/Week';
import Movie from './movie/Movie';
import Menu from './menu/Menu';
import Settings from './settings/Settings';
import ComingSoon from './coming-soon/ComingSoon';
import { Store } from 'store';

// Constants
export const WEEK = 'biohusid.WeekScreen';
export const MOVIE = 'biohusid.MovieScreen';
export const MENU = 'biohusid.MenuSidebar';
export const SETTINGS = 'biohusid.SettingsScreen';
export const COMING_SOON = 'biohusid.ComingSoonScreen';

// Screen component map
export const Screens = new Map();
Screens.set(WEEK, Week);
Screens.set(MOVIE, Movie);
Screens.set(MENU, Menu);
Screens.set(SETTINGS, Settings);
Screens.set(COMING_SOON, ComingSoon);

export const startApp = () => {

  const weekScreen = {
    stack: {
      id: 'WEEK_SCREEN',
      children: [
        {
          component: {
            name: WEEK,
          },
        },
      ],
    },
  };

  const comingSoonScreen = {
    stack: {
      id: 'COMING_SOON_SCREEN',
      children: [
        {
          component: {
            name: COMING_SOON,
          },
        },
      ],
    },
  };

  const settingsScreen = {
    stack: {
      id: 'SETTINGS_SCREEN',
      children: [
        {
          component: {
            name: SETTINGS,
          },
        },
      ],
    },
  };

  if (Platform.OS === 'ios') {
    return Navigation.setRoot({
      root: {
        bottomTabs: {
          id: 'BOTTOM_TABS',
          children: [
            weekScreen,
            comingSoonScreen,
            settingsScreen,
          ],
        },
      },
    });
  }

  return Navigation.setRoot({
    root: {
      sideMenu: {
        left: {
          component: {
            name: MENU,
          },
        },
        center: {
          stack: {
            id: 'CENTER',
            children: weekScreen.stack.children,
          },
        },
      },
    },
  });
};

interface IPushMovieScreenProps {
  componentId: string;
  movieId: string;
  elementId: string;
  selectedTab?: number;
}

export const pushMovieScreen = ({
  componentId,
  movieId,
  elementId,
  selectedTab,
}: IPushMovieScreenProps) => {
  const { posterAnimation } = Store.settings;
  Navigation.push(componentId, {
    component: {
      name: MOVIE,
      passProps: {
        movieId,
        selectedTab,
      },
      options: (!elementId || !posterAnimation) ? {} : {
        animations: {
          push: {
            waitForRender: true,
            enabled: true,
            content: {
              alpha: {
                from: 0,
                to: 1,
                duration: 750,
              },
            },
          },
        },
        customTransition: {
          animations: [
            {
              type: 'sharedElement',
              fromId: elementId,
              toId: 'MOVIE_POSTER',
              startDelay: 0,
              springVelocity: 0.9,
              springDamping: 0.9,
              duration: 1000 * Platform.select({ ios: 0.001, android: 1 }),
              interactivePop: true,
            },
          ],
        },
      },
    },
  });
};
