import { observable, autorun, computed } from 'mobx';
import moment from 'moment';
import _toArray from 'lodash/toArray';

export default class Movies {

  constructor(store) {
    this.db = store.db;
    this.UI = store.UI;
  }

  /**
   * @var Store raw response from firebase
   */
  @observable
  inTheatersCache = [];

  /**
   * @var List of coming soon movies
   */
  @observable
  comingSoon = [];

  /**
   * Filters and sorts the results based on preferences.
   * @uses store.UI.filter
   * @uses store.movies.inTheatersCache
   */
  @computed
  get inTheaters() {
    const { orderBy, rating, theaters } = this.UI.filter;
    return this.inTheatersCache.map(items =>
      _toArray(items)
      .sort((a, b) => {
        if (orderBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (orderBy === 'rating') {
          return ((b.imdb && b.imdb.rating) || 0) - ((a.imdb && a.imdb.rating) || 0);
        }
        return (_toArray(b.showtimes).length - _toArray(a.showtimes).length);
      })
      .filter(({ imdb, showtimes }) => {
        if ((parseFloat(imdb && imdb.rating) || 0) < rating) {
          return false;
        }

        if (theaters.length > 0) {
          if (!_toArray(showtimes).find(showtime => theaters.indexOf(showtime.cinema) >= 0)) {
            return false;
          }
        }

        return true;
      }),
    );
  }

  /**
   * Subscribe to the in-theaters datastore.
   * @param {Number} Number of days
   * @return {function} Cancellable token
   */
  subscribeInTheaters(days = 5) {
    const ref = this.db.ref('in-theaters');
    autorun(() => {
      const date = this.UI.dateYmd;
      if (this.lastDate && this.lastDate === date) return;
      if (this.lastDate) ref.off();
      this.lastDate = date;
      ref.orderByKey().startAt(date).limitToFirst(days)
      .on('value', (snapshot) => {
        this.inTheatersCache = Object.entries(snapshot.val())
        .sort((a, b) => moment(a[0]).diff(moment(b[0])))
        .map(item => item[1]);
      });
    });
    return () => ref.off();
  }

  /**
   * Helper method to get a list of movies by day.
   * @param {Number} day index
   * @return {Array} List of movies
   */
  getInTheatersByDay(index) {
    if (this.inTheaters.length > index) {
      return this.inTheaters[index];
    }
    return null;
  }

  /**
   * List of showtimes groupped by days.
   * @param {Number} Movie id
   * @return {Array<Array>} List of days of showtimes.
   */
  getMovieShowtimes(id) {
    return this.inTheatersCache.map(movies => _toArray((movies[id] && movies[id].showtimes) || []));
  }

  /**
   * Subscribe to coming soon
   * @return {function} Cancellable token
   */
  subscribeComingSoon() {
    const ref = this.db.ref('coming-soon');
    ref.orderByKey()
    .startAt(this.UI.dateYmd)
    .on('value', (snapshot) => {
      this.comingSoon = Object.entries(snapshot.val())
      .map(([key, val]) => ({ date: key, items: val }));
    });
    return () => ref.off();
  }
}
