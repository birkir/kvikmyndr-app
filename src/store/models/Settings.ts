import { types } from 'mobx-state-tree';
import config from 'config';
import { Platform } from 'react-native';
import en_US from 'date-fns/locale/en-US';
import { dateFnsLocaleIS, locales } from 'utils/locales';

export const SortBys = {
  popularity: 'SORT_POPULARITY',
  title: 'SORT_TITLE',
  rating: 'SORT_RATING',
};

export const Browsers = {
  inApp: 'In-App',
  default: Platform.select({ ios: 'Safari', android: 'Chrome' }),
};

export const Languages = {
  en: 'English',
  is: 'Íslenska',
};

export const Themes = {
  light: 'Light',
  dark: 'Dark',
};

export const SortBy = types.enumeration('SortBy', Object.keys(SortBys));
export const Theme = types.enumeration('Theme', Object.keys(Themes));
export const Language = types.enumeration('Language', Object.keys(Languages));
export const Browser = types.enumeration('Browser', Object.keys(Browsers));

export const Settings = types.model('Settings', {
  theme: types.optional(Theme, 'dark'),
  language: types.optional(Language, 'en'),
  promptOnExit: types.optional(types.boolean, true),
  posterAnimation: types.optional(types.boolean, true),
  hideSynopsis: types.optional(types.boolean, false),
  hideCast: types.optional(types.boolean, false),
  hideDaysOnScroll: types.optional(types.boolean, false),
  useReaderMode: types.optional(types.boolean, false),
  browser: types.optional(Browser, 'inApp'),
  weekSortBy: types.optional(SortBy, 'popularity'),
  isBeta: types.optional(types.boolean, config.isTestFlight || false),
})
.views((self) => {
  return {
    get locale() {
      return locales[self.language];
    },
    get dateLocale() {
      if (self.language === 'is') {
        return dateFnsLocaleIS;
      }
      return en_US;
    },
    get browserDisplay() {
      return Browsers[self.browser];
    },
    get languageDisplay() {
      return Languages[self.language];
    },
  };
})
.actions(self => ({
  setWeekSortBy(value: typeof SortBy.Type) {
    self.weekSortBy = value;
  },
  setLanguage(value: typeof Language.Type) {
    self.language = value;
  },
  setBrowser(value: typeof Browser.Type) {
    self.browser = value;
  },
  setHideDaysOnScroll(value: boolean) {
    self.hideDaysOnScroll = value;
  },
  setHideSynopsis(value: boolean) {
    self.hideSynopsis = value;
  },
  setHideCast(value: boolean) {
    self.hideCast = value;
  },
  setPosterAnimation(value: boolean) {
    self.posterAnimation = value;
  },
  setUseReaderMode(value: boolean) {
    self.useReaderMode = value;
  },
  setIsBeta(value: boolean) {
    self.isBeta = value;
  },
}));
