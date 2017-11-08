import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import uniqBy from 'lodash/uniqBy';
import debounce from 'lodash/debounce';

const query = gql`
  query movies($from: DateTime, $cursor: String, $limit: Int) {
    movies: allMovies(
      filter: {
        releaseDate_gte: $from
      }
      after: $cursor
      first: $limit
    ) {
      id
      title
      posterUrl
      backdropUrl
      releaseDate
      runtime
      imdbRating
      metacriticRating
      genres { name }
    }
  }
`;

export default graphql(query, {
  options: ({ ui }) => ({
    variables: {
      from: new Date(ui.dateYmd),
    },
  }),
  props(props) {
    const { data: { loading, movies, fetchMore }, ownProps: { ui } } = props;
    return {
      data: {
        ...props.data,
        fetchMore: debounce(() => {
          if (loading) return false;
          return fetchMore({
            query,
            variables: {
              from: new Date(ui.dateYmd),
              limit: 4,
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
