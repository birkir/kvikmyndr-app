import { types } from 'mobx-state-tree';
import { Locale } from './Locale';

export const GenreLocale = types.model('GenreLocale', {
  id: types.identifier,
  locale: types.maybe(Locale),
  name: types.maybe(types.string),
});

export const Genre = types.model('Genre', {
  id: types.identifier,
  externalId: types.maybe(types.number),
  name: types.maybe(types.string),
  locales: types.maybe(types.array(GenreLocale)),
});
