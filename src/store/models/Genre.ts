import { types } from 'mobx-state-tree';
import { Locale } from './Locale';

export const GenreLocale = types.model('GenreLocale', {
  id: types.identifier,
  // createdAt: types.Date,
  // updatedAt: types.Date,
  locale: types.maybe(Locale),
  name: types.maybe(types.string),
});

export const Genre = types.model('Genre', {
  id: types.identifier,
  // createdAt: types.Date,
  // updatedAt: types.Date,
  externalId: types.maybe(types.number),
  name: types.maybe(types.string),
  locales: types.maybe(types.array(GenreLocale)),
});
