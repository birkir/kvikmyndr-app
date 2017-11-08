import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import addDays from 'date-fns/add_days';
import { basic, detailed } from './movieFields';

const queryBasic = graphql(gql`
  query movieBasic($id: ID) {
    movie: Movie(id: $id) { ${basic} }
  }
`, {
  options: ({ movie }) => ({
    variables: {
      id: movie.id,
    },
  }),
});

const queryDetail = graphql(gql`
  query movieDetail(
    $id: ID,
    $playingFrom: DateTime,
    $playingTo: DateTime
  ) {
    movie: Movie(id: $id) { ${detailed} }
  }
`, {
  options: ({ movie, ui }) => ({
    variables: {
      id: movie.id,
      playingFrom: ui.dateYmd,
      playingTo: addDays(ui.dateYmd, 5),
    },
  }),
  props: ({ ownProps, data }) => ({
    data: {
      ...data,
      movie: {
        ...ownProps.data.movie,
        ...data.movie,
      },
    },
  }),
});

export default compose(queryBasic, queryDetail);
