import { types } from 'mobx-state-tree';
import config from 'config';

export const SortBy = types.enumeration('SortBy', [
  'popularity',
  'title',
  'rating',
]);

export const Settings = types.model('Settings', {
  theme: types.optional(types.enumeration('Theme', ['light', 'dark']), 'dark'),
  promptOnExit: types.optional(types.boolean, true),
  posterAnimation: types.optional(types.boolean, true),
  hideSynopsis: types.optional(types.boolean, false),
  hideDaysOnScroll: types.optional(types.boolean, true),
  weekSortBy: types.optional(SortBy, 'popularity'),
  isBeta: types.optional(types.boolean, config.isTestFlight || false),
})
.actions(self => ({
  setWeekSortBy(value: typeof SortBy.Type) {
    self.weekSortBy = value;
  },
}));
