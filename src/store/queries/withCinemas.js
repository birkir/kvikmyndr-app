import { gql, graphql } from 'react-apollo';

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
