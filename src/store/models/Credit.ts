import { types } from 'mobx-state-tree';
import { Cast } from './Cast';

const CreditType = types.enumeration('CreditType', [
  'CAST',
  'CREW',
]);

export const Credit = types.model('Credit', {
  id: types.identifier,
  // externalId: types.maybe(types.string),
  cast: types.maybeNull(Cast),
  // order: types.maybe(types.number),
  role: types.maybe(types.string),
  type: types.maybe(CreditType),
});

export type ICredit = typeof Credit.Type;
