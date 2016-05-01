import React, {
  Component,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableHighlight,
  ListView
} from 'react-native';

import Rebase from 're-base';
import MovieListItem from '../components/MovieListItem';
import MovieDetails from './MovieDetails';

export default class SceneInTheaters extends Component {

  constructor(...args) {
    super(...args);

    this.base = Rebase.createClass('https://kvikmyndr.firebaseio.com');

    this.state = {
      loading: true,
      movies: new ListView.DataSource({
        rowHasChanged: (row1, row2) => (row1 !== row2)
      }),
      firebaseKey: (new Date()).toISOString().substr(0, 10),
    };

    this.onPress = this.onPress.bind(this);
  }

  /**
   * Fired when component was mounted
   *
   * @return void
   */
  componentDidMount () {
    this.ref = this.base.listenTo(`in-show/${this.state.firebaseKey}`, {
      context: this,
      asArray: true,
      queries: {
        orderByChild: 'showtimeCount'
      },
      then (data) {
        data.reverse();
        this.setState({
          movies: this.state.movies.cloneWithRows(data)
        });
      }
    });
  }

  /**
   * Fired when component will unmount
   * @return void
   */
  componentWillUnmount () {
    // Remove firebase binding to ref
    this.base.removeBinding(this.ref);
  }

  renderRow(movie) {
    return (
      <TouchableHighlight key={movie.id} underlayColor="#f8f8ee" onPress={() => this.onPress(movie)}>
        <View>
          <MovieListItem {...movie} />
        </View>
      </TouchableHighlight>
    );
  }

  onPress(movie) {
    this.props.navigator.push({
      title: movie.title,
      component: MovieDetails,
      passProps: {
        movie,
        date: this.state.firebaseKey,
      },
    });
  }

  /**
   * Render method
   * @return {Component}
   */
  render () {
    return (
      <View style={{ flex: 1 }}>
        <ListView
          dataSource={this.state.movies}
          renderRow={this.renderRow.bind(this)}
          styles={{ flex: 1 }}
        />
      </View>
    );
  }
}
