import { types } from 'mobx-state-tree';
import { CinemaReference } from '../cinemas';

export const Showtime = types.model('Showtime', {
  id: types.identifier,
  // createdAt: types.Date,
  // updatedAt: types.Date,
  playingAt: types.maybe(types.string),
  cinema: types.maybe(CinemaReference),
  room: types.maybe(types.string),
  ticketUrl: types.maybe(types.string),
  flags: types.array(types.string),
});

export type IShowtime = typeof Showtime.Type;
