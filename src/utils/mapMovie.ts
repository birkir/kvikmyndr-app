export function mapMovie(obj: any, isPartial: boolean) {
  const movie = { ...obj };
  movie.isPartial = isPartial;
  // movie.homepage = movie.homepage || undefined;
  // movie.metacriticRating = movie.metacriticRating || undefined;
  // movie.trailerUrl = movie.trailerUrl || undefined;
  movie.genres = (movie.genres || []).map((genre: { id: string }) => genre.id);
  movie.showtimes = (movie.showtimes || []).map((showtime: any) => ({
    ...showtime,
    // playingAt: new Date(showtime.playingAt),
    cinema: showtime.cinema ? showtime.cinema.id : undefined,
  }));
  // movie.releaseDate = new Date(movie.releaseDate);
  // movie.createdAt = new Date(movie.createdAt);
  // movie.updatedAt = new Date(movie.updatedAt);
  // movie.locales = (movie.locales || []).map((locale: any) => ({
  //   ...locale,
  //   releaseDate: new Date(locale.releaseDate),
  // }));

  return movie;
}
