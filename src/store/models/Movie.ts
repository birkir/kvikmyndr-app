import { types } from 'mobx-state-tree';
import { GenreReference } from '../genres';
import { Showtime, IShowtime } from './Showtime';
import { Locale } from './Locale';
import { Credit } from './Credit';
import { Language } from './Language';
import { toMovieDate } from 'utils/toMovieDate';
import { mapMovie } from 'utils/mapMovie';
import { uniqBy } from 'lodash';
interface IMovieLocale {
  contentRating?: string;
  title?: string;
  summary?: string;
  alternateTitle?: string;
  releaseDate?: string;
}

export const MovieStatus = types.enumeration('MovieStatus', [
  'RELEASED',
  'POST_PRODUCTION',
]);

export const MovieLocale = types.model('MovieLocale', {
  id: types.identifier,
  locale: Locale,
  contentRating: types.maybeNull(types.string),
  title: types.maybeNull(types.string),
  summary: types.maybeNull(types.string),
  alternateTitle: types.maybeNull(types.string),
  releaseDate: types.maybeNull(types.string),
});

export const Movie = types.model('Movie', {
  id: types.identifier,
  isPartial: types.optional(types.boolean, true),
  // createdAt: types.Date,
  // updatedAt: types.Date,
  title: types.maybeNull(types.string),
  year: types.maybeNull(types.number),
  summary: types.maybeNull(types.string),
  runtime: types.maybeNull(types.number),
  backdropUrl: types.maybeNull(types.string),
  posterUrl: types.maybeNull(types.string),
  releaseDate: types.maybeNull(types.string),
  adult: types.maybeNull(types.boolean),
  imdbId: types.maybeNull(types.string),
  externalId: types.maybeNull(types.number),
  tmdbId: types.maybeNull(types.number),
  budget: types.maybeNull(types.number),
  revenue: types.maybeNull(types.number),
  homepage: types.maybeNull(types.string),
  originalLanguage: types.maybeNull(types.string),
  originalTitle: types.maybeNull(types.string),
  status: types.maybeNull(MovieStatus),
  tagline: types.maybeNull(types.string),
  tmdbPopularity: types.maybeNull(types.number),
  imdbRating: types.maybeNull(types.number),
  imdbVotes: types.maybeNull(types.number),
  tmdbRating: types.maybeNull(types.number),
  tmdbVotes: types.maybeNull(types.number),
  metacriticVotes: types.maybeNull(types.number),
  metacriticRating: types.maybeNull(types.number),
  genres: types.optional(types.array(GenreReference), []),
  showtimes: types.maybeNull(types.array(Showtime)),
  contentRating: types.maybeNull(types.string),
  trailerUrl: types.maybeNull(types.string),
  keywords: types.optional(types.array(types.string), []),
  credits: types.optional(types.array(Credit), []),
  locales: types.optional(types.array(MovieLocale), []),
  languages: types.optional(types.array(Language), []),
})
.actions(self => ({
  update(obj: any, isPartial: boolean) {
    const isFull = !self.isPartial;
    const movie = mapMovie(obj, isPartial);

    // Merge showtimes
    // TODO: Cached movie loaded will have undefined showtimes for the first page!!
    movie.showtimes = uniqBy(
      [
        ...movie.showtimes,
        ...(self.showtimes || []),
      ],
      'id',
    );

    Object.entries(movie).forEach(([key, value]) => {
      self[key] = value;
    });
    if (isFull) {
      self.isPartial = false;
    }
  },
}))
.views(self => ({
  get posterUrlNormal() {
    return `https://image.tmdb.org/t/p/w342/${self.posterUrl}`;
  },
  get posterUrlOriginal() {
    return `https://image.tmdb.org/t/p/original/${self.posterUrl}`;
  },
  get backdropImageUrl() {
    return `https://image.tmdb.org/t/p/w780/${self.backdropUrl}`;
  },
  get formatRuntime() {
    return `${self.runtime} min`;
  },
  get locale(): IMovieLocale {
    const loc = self.locales.find(({ locale }: any) => locale === 'ICELANDIC') || {} as any;
    return {
      title: loc.title || self.title,
      summary: loc.summary || self.summary,
      contentRating: loc.contentRating || self.contentRating,
      releaseDate: loc.releaseDate || self.releaseDate,
    };
  },
  showtimesForDate(date: Date): IShowtime[] {
    if (!self.showtimes) {
      return [];
    }
    return self.showtimes.filter(showtime =>
      showtime.playingAt &&
      toMovieDate(new Date(showtime.playingAt)).toISOString().substr(0, 10) ===
      date.toISOString().substr(0, 10),
    );
  },
}));

export type IMovie = typeof Movie.Type;
