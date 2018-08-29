import { types } from 'mobx-state-tree';

export const Cinema = types.model('Cinema', {
  id: types.identifier,
  name: types.maybe(types.string),
  // createdAt: types.Date,
  // updatedAt: types.Date,
  // locales: types.maybe(types.array(GenreLocale)),
});

export type ICinema = typeof Cinema.Type;
