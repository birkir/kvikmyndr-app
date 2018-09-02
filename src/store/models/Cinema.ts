import { types } from 'mobx-state-tree';

export const Cinema = types.model('Cinema', {
  id: types.identifier,
  name: types.maybe(types.string),
});

export type ICinema = typeof Cinema.Type;
