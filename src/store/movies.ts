import { types, flow } from 'mobx-state-tree';
import { Movie } from './models/Movie';
import { client } from '../services/graphql.service';
import fetchMovieByIdQuery from '../queries/fetchMovieById.gql';
import fetchNewMoviesQuery from '../queries/fetchNewMovies.gql';
import { addDays } from 'date-fns';
import { mapMovie } from 'utils/mapMovie';

export const Movies = types.model('Movies', {
  movies: types.map(Movie),
  comingSoon: types.array(types.reference(Movie)),
})
.actions(self => ({
  addPartialMovie: (obj: any) => {
    return (self as any).addMovie(obj, true);
  },
  addMovie: (obj: any, isPartial: boolean) => {
    if (self.movies.has(obj.id)) {
      const movie = self.movies.get(obj.id);
      return movie!.update(obj, isPartial);
    }

    return self.movies.put(
      Movie.create(mapMovie(obj, isPartial)),
    );
  },
  loadMovieById: flow(function* loadMovieById(movieId: string) {
    const start = new Date();
    const end = addDays(start, 5);
    const result = yield client.query({
      query: fetchMovieByIdQuery,
      fetchPolicy: 'network-only',
      variables: {
        movieId,
        start: start.toISOString().substr(0, 10),
        end: end.toISOString().substr(0, 10),
      },
    });

    (self as any).addMovie(result.data.Movie, false);
  }),
  loadNewMovies: flow(function* loadNewMovies() {
    const result = yield client.query({
      query: fetchNewMoviesQuery,
      fetchPolicy: 'network-only',
      variables: {
        from: new Date().toISOString().substr(0, 10),
      },
    });
    result.data.allMovies.map(Movies.addPartialMovie);
    self.comingSoon.clear();
    self.comingSoon.push(
      ...result.data.allMovies.map((movie: { id: string }) => movie.id),
    );
  }),
}))
.views(self => ({
  getOrLoadById(movieId: string) {
    const movie = self.movies.get(movieId);
    if (!movie) {
      setImmediate(() => self.loadMovieById(movieId));
    }
    return movie;
  },
}))
.create();
