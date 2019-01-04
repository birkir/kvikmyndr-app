import { types } from 'mobx-state-tree';
import { CinemaReference } from '../cinemas';
import store from '../index';

export const Showtime = types.model('Showtime', {
  id: types.identifier,
  playingAt: types.maybe(types.string),
  cinema: types.maybe(CinemaReference),
  room: types.maybe(types.string),
  ticketUrl: types.maybe(types.string),
  flags: types.array(types.string),
})
.views(self => ({
  get disabled() {
    const timeInIceland = new Date(store.date.toISOString().substr(0, 23));
    if (self.playingAt) {
      const playingAt = new Date(self.playingAt);
      return playingAt.getTime() < timeInIceland.getTime();
    }
    return false;
  },
}));

export type IShowtime = typeof Showtime.Type;
