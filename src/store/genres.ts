import { types, flow } from 'mobx-state-tree';
import { client } from '../services/graphql.service';
import { Genre } from './models/Genre';
import fetchGenreByIdQuery from '../queries/fetchGenreById.gql';
import fetchAllGenres from '../queries/fetchAllGenres.gql';

export const GenreReference = types.reference(Genre, {
  get(identifier: string) {
    return Genres.getOrLoadById(identifier) as typeof Genre.Type || [];
  },
  set(value) {
    return value.id;
  },
});

export const Genres = types.model('Genres', {
  genres: types.map(Genre),
})
.actions((self) => {

  const addGenre = (obj: any) => {
    const genre = { ...obj };
    if (self.genres.has(genre.id)) {
      return;
    }

    return self.genres.put(
      Genre.create(genre),
    );
  };

  const loadAllGenres = flow(function* () {

    const result = yield client.query({
      query: fetchAllGenres,
      fetchPolicy: 'network-only',
    });

    result.data.allGenres.map(addGenre);
  });

  const loadGenreById = flow(function* (genreId: string) {
    const result = yield client.query({
      query: fetchGenreByIdQuery,
      fetchPolicy: 'network-only',
      variables: {
        genreId,
      },
    });

    addGenre(result.data.Genre);
  });

  return {
    loadAllGenres,
    loadGenreById,
    addGenre,
  };
})
.views(self => ({
  getOrLoadById(genreId: string) {
    const genre = self.genres.get(genreId);
    if (!genre) {
      setImmediate(() => self.loadGenreById(genreId));
    }
    return genre;
  },
}))
.create();
