import { AsyncStorage, AppState } from 'react-native';
import { observable, toJS } from 'mobx';
import { autobind } from 'core-decorators';
import Firestack from 'react-native-firestack';
import _get from 'lodash/get';
import _set from 'lodash/set';
import env from '../utils/env';
import UI from './UI';
import User from './User';
import Movies from './Movies';

class Store {

  constructor() {
    // Setup firestack
    this.firestack = new Firestack(env.firebase);

    // Make a shorthand database ref
    this.db = this.firestack.database;

    // Setup stores
    this.UI = new UI();
    this.user = new User(this);
    this.movies = new Movies(this);

    // Initialize store
    this.initialize();
  }

  static KEY = '@Biohusid.storage';

  static keys = [
    'UI.language',
    'UI.filter',
    'UI.showSynopsis',
    'movies.inTheatersCache',
    'movies.comingSoon',
  ];

  @observable
  isLoading = true;

  @autobind
  async initialize() {
    try {
      const storage = await AsyncStorage.getItem(Store.KEY);
      const data = JSON.parse(storage);
      Store.keys.forEach((key) => {
        const value = _get(data, key);
        if (value !== undefined) {
          _set(this, key, value);
        }
      });
    } catch (err) {
      // TODO: Catch errors
    }

    // Persist data on every appstate change
    AppState.addEventListener('change', this.persist);

    // Allow app to render
    this.isLoading = false;
  }

  @autobind
  async persist() {
    try {
      const data = {};
      const store = toJS(this);
      Store.keys.forEach(key => (data[key] = _get(store, key)));
      await AsyncStorage.setItem(Store.KEY, JSON.stringify(data));
    } catch (err) {
      // TODO: Catch errors
    }
  }
}

export default new Store();
