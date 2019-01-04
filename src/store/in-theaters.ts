import { types, flow } from 'mobx-state-tree';
import { client } from '../services/graphql.service';
import fetchMoviesForWeekQuery from '../queries/fetchMoviesForWeek.gql';
import { Movies } from './movies';
import { Movie } from './models/Movie';
import { addDays } from 'date-fns';
import { addHours } from 'date-fns/esm';

interface IShowtimeFromDb {
  playingAt: string;
}

interface IMovieFromDb {
  id: string;
  showtimes: IShowtimeFromDb[];
}

export const InTheaters = types.model('InTheaters', {
  loading: false,
  loaded: false,
  dates: types.map(types.model('DateOfMovies', {
    date: types.identifier,
    movies: types.map(types.model('MovieRef', {
      id: types.identifier,
      movie: types.reference(Movie, {
        get(identifier: string) {
          return Movies.movies.get(identifier) as typeof Movie.Type;
        },
        set(value: typeof Movie.Type) {
          return value.id;
        },
      }),
    })),
  })),
})
.views(self => ({
  moviesForDate(date: Date) {
    const movies = self.dates.get(date.toISOString().substr(0, 10));
    if (movies) {
      return Array.from(movies.movies.values());
    }
    return [];
  },
}))
.actions(self => ({
  loadWeek: flow(function* loadWeek() {

    self.loading = true;

    const start = new Date();
    const end = addDays(start, 5);

    const result = yield client.query({
      query: fetchMoviesForWeekQuery,
      fetchPolicy: 'network-only',
      variables: {
        start: start.toISOString().substr(0, 10),
        end: end.toISOString().substr(0, 10),
      },
    });

    result.data.allMovies.map(Movies.addPartialMovie);

    result.data.allMovies.forEach((movie: IMovieFromDb) => {
      movie.showtimes.forEach((showtime) => {
        const dateKey = addHours(new Date(showtime.playingAt), -4).toISOString().substr(0, 10);

        if (!self.dates.has(dateKey)) {
          self.dates.put({
            date: dateKey,
            movies: {},
          });
        }

        const dateOf = self.dates.get(dateKey);
        if (dateOf) {
          dateOf.movies.put({ id: movie.id, movie: movie.id });
        }
      });
    });

    self.loaded = true;
    self.loading = false;
  }),
}))
.create({
  dates: {},
});
