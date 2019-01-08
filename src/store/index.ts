import { AsyncStorage } from 'react-native';
import { types, flow, applySnapshot, onSnapshot } from 'mobx-state-tree';
import makeInspectable from 'mobx-devtools-mst';
import { debounce } from 'lodash';
import { Settings } from './models/Settings';
import { InTheaters } from 'store/in-theaters';
import { Movies } from 'store/movies';
import { Genres } from 'store/genres';
import { Cinemas } from 'store/cinemas';

export const Store = types
  .model('Store', {
    settings: Settings,
    componentId: types.optional(types.string, ''),
    menuComponentId: types.optional(types.string, ''),
    insets: types.optional(types.model({ top: 0, bottom: 0 }), {}),
    isHydrated: types.optional(types.boolean, false),
    date: types.Date,
  })
  .actions(self => ({
    hydrate: flow(function* () {

      if (__DEV__) {
        // Inspect individual models
        makeInspectable(self);
        makeInspectable(Movies);
        makeInspectable(InTheaters);
        makeInspectable(Genres);
      }

      const storageKey = 'Store.settings';
      const data = JSON.parse(yield AsyncStorage.getItem(storageKey));
      if (data) {
        applySnapshot(self.settings, data);
      }

      onSnapshot(self.settings, debounce(
        snapshot => AsyncStorage.setItem(storageKey, JSON.stringify(snapshot)),
        1000,
      ));

      // Load all supplimental data
      Genres.loadAllGenres();
      Cinemas.loadAllCinemas();

      self.isHydrated = true;
    }),
    setComponentId(componentId: string) {
      self.componentId = componentId;
    },
    setMenuComponentId(componentId: string) {
      self.menuComponentId = componentId;
    },
    setInsets(insets: any) {
      self.insets.top = insets.top;
      self.insets.bottom = insets.bottom;
    },
  }))
  .create({
    settings: Settings.create(),
    date: new Date(),
  });

export default Store;
