import { types } from 'mobx-state-tree';
import { Cast } from './Cast';

const CreditType = types.enumeration('CreditType', [
  'CAST',
  'CREW',
]);

export const Credit = types.model('Credit', {
  id: types.identifier,
  cast: types.maybeNull(Cast),
  role: types.maybe(types.string),
  type: types.maybe(CreditType),
});

export type ICredit = typeof Credit.Type;
