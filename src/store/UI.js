import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist';

const Layout = {
  LIST: 0,
  GRID: 1,
};

export default class UI {

  static Layout = Layout;

  constructor() {
    // Update internal clock on every 60 sec
    setInterval(this.refreshDate, 60000);
  }

  @action
  refreshDate() {
    this.date = new Date();
  }

  @observable
  date = new Date();

  @computed
  get dateYmd() {
    return this.date.toISOString().substr(0, 10);
  }

  @persist('object')
  @observable
  inTheatersFilter = {
    sortBy: 'popularity',
    cinemas: [],
    rating: 0.0,
    hours: ['00:00', '00:00'],
  };

  @persist('object')
  @observable
  settings = {
    movieCardLayout: Layout.LIST,
  };

  @observable
  inTheatersHeader = {
    daysFromNow: 0,
  };

}
