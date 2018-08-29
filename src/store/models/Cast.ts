import { types } from 'mobx-state-tree';
import { Gender } from './Gender';

export const Cast = types.model('Cast', {
  id: types.identifier,
  // externalId: types.maybe(types.string),
  name: types.maybeNull(types.string),
  // gender: types.maybe(Gender),
  pictureUrl: types.maybeNull(types.string),
});
