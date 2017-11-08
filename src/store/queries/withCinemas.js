import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const query = gql`
  query {
    items: allCinemas {
      id
      name
    }
  }
`;

export default graphql(query, {
  props: ({ data }) => ({
    cinemas: data,
  }),
});
