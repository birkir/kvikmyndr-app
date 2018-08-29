import { AsyncStorage } from 'react-native';
import { types, flow, applySnapshot, onSnapshot } from 'mobx-state-tree';
import makeInspectable from 'mobx-devtools-mst';
import debounce from 'lodash/debounce';
import { Settings } from './models/Settings';
import { InTheaters } from 'store/in-theaters';
import { Movies } from 'store/movies';
import { Genres } from 'store/genres';
import { Cinemas } from 'store/cinemas';

export const Store = types
  .model('Store', {
    settings: Settings,
    componentId: types.maybe(types.string),
    isHydrated: types.optional(types.boolean, false),
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

      const storeKeys = {
        settings: self.settings,
        movies: Movies,
        genres: Genres,
        cinemas: Cinemas,
        week: InTheaters,
      };

      for (const key in storeKeys) {
        if (storeKeys.hasOwnProperty(key)) {
          const storageKey = `Store.${key}`;

          const data = JSON.parse(yield AsyncStorage.getItem(storageKey));
          if (data) {
            applySnapshot(storeKeys[key], data);
          }

          onSnapshot(storeKeys[key], debounce(
            snapshot => AsyncStorage.setItem(storageKey, JSON.stringify(snapshot)),
            1000,
          ));
        }
      }

      // Load all supplimental data
      Genres.loadAllGenres();
      Cinemas.loadAllCinemas();

      self.isHydrated = true;
    }),
    setComponentId(componentId: string) {
      self.componentId = componentId;
    },
  }))
  .create({
    settings: Settings.create(),
  });

export default Store;
