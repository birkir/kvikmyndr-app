/**
 * Available sizes
 *
"backdrop_sizes": [
  "w300",
  "w780",
  "w1280",
  "original"
],
"poster_sizes": [
  "w92",
  "w154",
  "w185",
  "w342",
  "w500",
  "w780",
  "original"
]
*/
function getImageUrl(filename, size = 'w342') {
  if (filename === '') return '';
  return `https://image.tmdb.org/t/p/${size}${filename}`;
}

export default {
  getImageUrl,
};
