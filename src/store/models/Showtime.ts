import { types } from 'mobx-state-tree';
import { CinemaReference } from '../cinemas';
import { isBefore } from 'date-fns';

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
    if (self.playingAt) {
      return isBefore(self.playingAt, new Date());
    }
    return false;
  },
}));

export type IShowtime = typeof Showtime.Type;
