import { gql, graphql } from 'react-apollo';
import uniqBy from 'lodash/uniqBy';
import debounce from 'lodash/debounce';
import addDays from 'date-fns/add_days';
import { basic } from './movieFields';

const limit = 30;

const query = gql`
  query movies(
    $from: DateTime,
    $to: DateTime,
    $orderBy: MovieOrderBy,
    $cursor: String,
    $limit: Int
    $cinemas: [ID!]
  ) {
    movies: allMovies(
      filter: {
        showtimes_some: {
          playingAt_gte: $from,
          playingAt_lte: $to,
          cinema: { id_in: $cinemas }
        }
      }
      orderBy: $orderBy
      after: $cursor
      first: $limit
    ) { ${basic} }
  }
`;

const mapSortBy = (key) => {
  if (key === 'popularity') return undefined;
  if (key === 'title') return 'title_ASC';
  if (key === 'rating') return 'imdbRating_DESC';
  if (key === 'runtime') return 'runtime_ASC';
  return undefined;
};

export default graphql(query, {
  options: ({ ui, daysFromNow = 0 }) => ({
    variables: {
      orderBy: mapSortBy(ui.inTheatersFilter.sortBy),
      from: addDays(ui.dateYmd, daysFromNow),
      to: addDays(ui.dateYmd, daysFromNow + 1),
      cinemas: ui.inTheatersFilter.cinemas,
      limit,
    },
  }),
  props(props) {
    const { data: { loading, movies, variables, fetchMore, refetch } } = props;
    return {
      data: {
        ...props.data,
        refetch: () => {
          const { ui, daysFromNow = 0 } = props.ownProps;
          const { sortBy, cinemas } = ui.inTheatersFilter;
          refetch({
            orderBy: mapSortBy(sortBy),
            from: addDays(ui.dateYmd, daysFromNow),
            to: addDays(ui.dateYmd, daysFromNow + 1),
            cinemas: cinemas.length === 0 ? undefined : cinemas,
            limit,
          });
        },
        fetchMore: debounce(() => {
          if (loading) return false;
          return fetchMore({
            query,
            variables: {
              ...variables,
              cursor: movies[movies.length - 1].id,
            },
            updateQuery: (prev, { fetchMoreResult }) => ({
              movies: uniqBy(
                [...prev.movies, ...fetchMoreResult.movies], item => item.id,
              ),
            }),
          });
        }, 600),
      },
    };
  },
});
