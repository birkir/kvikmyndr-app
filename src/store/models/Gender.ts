import { types } from 'mobx-state-tree';

export const Gender = types.enumeration('Gender', [
  'MALE',
  'FEMALE',
  'UNKNOWN',
]);
