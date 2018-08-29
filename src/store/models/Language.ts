import { types } from 'mobx-state-tree';

export const Language = types.model('Language', {
  id: types.identifier,
  name: types.maybe(types.string),
});
