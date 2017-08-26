export const basic = `
  id
  title
  posterUrl
  backdropUrl
  runtime
  imdbRating
  imdbId
  metacriticRating
  trailerUrl
  genres { name }
`;

export const detailed = `
  id
  releaseDate
  budget
  revenue
  tagline
  homepage
  credits {
    id
    cast {
      name
      pictureUrl
    }
    order
    role
  }
  locales (filter: { locale: ICELANDIC }) {
    locale
    title
    summary
  }
  showtimes (
    filter: {
      playingAt_gte: $playingFrom
      playingAt_lte: $playingTo
    }
    orderBy: playingAt_ASC
  ) {
    id
    cinema { name }
    playingAt
    room
    flags
    ticketUrl
  }
`;
