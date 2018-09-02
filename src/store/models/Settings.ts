import { types } from 'mobx-state-tree';
import config from 'config';
import { Platform } from 'react-native';

export const SortBy = types.enumeration('SortBy', [
  'popularity',
  'title',
  'rating',
]);

export const Browsers = {
  inApp: 'In-App',
  default: Platform.select({ ios: 'Safari', android: 'Chrome' }),
};

export const Languages = {
  en: 'English',
  is: 'Icelandic',
};

export const Theme = types.enumeration('Theme', ['light', 'dark']);
export const Language = types.enumeration('Language', Object.keys(Languages));
export const Browser = types.enumeration('Browser', Object.keys(Browsers));

export const Settings = types.model('Settings', {
  theme: types.optional(Theme, 'dark'),
  language: types.optional(Language, 'en'),
  promptOnExit: types.optional(types.boolean, true),
  posterAnimation: types.optional(types.boolean, true),
  hideSynopsis: types.optional(types.boolean, false),
  hideDaysOnScroll: types.optional(types.boolean, true),
  useReaderMode: types.optional(types.boolean, true),
  browser: types.optional(Browser, 'inApp'),
  weekSortBy: types.optional(SortBy, 'popularity'),
  isBeta: types.optional(types.boolean, config.isTestFlight || false),
})
.views((self) => {
  return {
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
  setPosterAnimation(value: boolean) {
    self.posterAnimation = value;
  },
  setUseReaderMode(value: boolean) {
    self.useReaderMode = value;
  },
}));
