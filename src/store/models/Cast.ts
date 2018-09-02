import { types } from 'mobx-state-tree';

export const Cast = types.model('Cast', {
  id: types.identifier,
  name: types.maybeNull(types.string),
  pictureUrl: types.maybeNull(types.string),
});
