import { types } from 'mobx-state-tree';
import { CinemaReference } from '../cinemas';
import store from '../index';
import { utcToZonedTime, toDate } from 'date-fns-tz';
import { addHours } from 'date-fns';

export const Showtime = types.model('Showtime', {
  id: types.identifier,
  playingAt: types.Date,
  cinema: types.maybe(CinemaReference),
  room: types.maybe(types.string),
  ticketUrl: types.maybe(types.string),
  flags: types.array(types.string),
})
.preProcessSnapshot((snapshot) => {
  const date = utcToZonedTime(snapshot.playingAt || 0, 'UTC');
  return {
    ...snapshot,
    playingAt: new Date(date),
  };
})
.views(self => ({
  get disabled() {
    const timeInIceland = utcToZonedTime(Date.now(), 'GMT');
    if (self.playingAt) {
      return self.playingAt.getTime() < timeInIceland.getTime();
    }
    return false;
  },
}));

export type IShowtime = typeof Showtime.Type;
