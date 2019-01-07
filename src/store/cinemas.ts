import { types, flow } from 'mobx-state-tree';
import { client } from '../services/graphql.service';
import { Cinema } from './models/Cinema';
import fetchCinemaByIdQuery from '../queries/fetchCinemaById.gql';
import fetchAllCinemas from '../queries/fetchAllCinemas.gql';

export const CinemaReference = types.reference(Cinema, {
  get(identifier: string) {
    return Cinemas.getOrLoadById(identifier) as typeof Cinema.Type || [];
  },
  set(value: typeof Cinema.Type) {
    return value.id;
  },
});

export const Cinemas = types.model('Cinemas', {
  cinemas: types.map(Cinema),
})
.actions((self) => {

  const addCinema = (obj: any) => {
    const cinema = { ...obj };
    if (self.cinemas.has(cinema.id)) {
      return;
    }

    return self.cinemas.put(
      Cinema.create(cinema),
    );
  };

  const loadAllCinemas = flow(function* () {

    const result = yield client.query({
      query: fetchAllCinemas,
      fetchPolicy: 'cache-and-network',
    });

    result.data.allCinemas.map(addCinema);
  });

  const loadCinemaById = flow(function* (cinemaId: string) {
    const result = yield client.query({
      query: fetchCinemaByIdQuery,
      fetchPolicy: 'network-only',
      variables: {
        cinemaId,
      },
    });

    addCinema(result.data.Cinema);
  });

  return {
    loadAllCinemas,
    loadCinemaById,
    addCinema,
  };
})
.views(self => ({
  getOrLoadById(cinemaId: string) {
    const cinema = self.cinemas.get(cinemaId);
    if (!cinema) {
      setImmediate(() => self.loadCinemaById(cinemaId));
    }
    return cinema;
  },
}))
.create();
