import React, {
  Component,
  Platform,
  Animated,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  ListView,
  PropTypes,
} from 'react-native';

import Rebase from 're-base';
import MovieListItem from '../components/MovieListItem';
import SceneDetail from './Detail';

export default class SceneInTheaters extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);

    // Create re-base instance
    this.base = Rebase.createClass('https://kvikmyndr.firebaseio.com');

    // Default state
    this.state = {
      loading: true,
      movies: new ListView.DataSource({
        rowHasChanged: (row1, row2) => (row1 !== row2),
      }),
      firebaseKey: (new Date()).toISOString().substr(0, 10),
      bounceValue: new Animated.Value(0),
    };

    // Superbinds
    this.onPress = this.onPress.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  /**
   * Fired when component was mounted
   * @return void
   */
  componentDidMount() {
    this.ref = this.base.listenTo(`in-show/${this.state.firebaseKey}`, {
      context: this,
      asArray: true,
      queries: {
        orderByChild: 'showtimeCount',
      },
      then(data) {
        data.reverse();
        this.setState({
          loading: false,
          movies: this.state.movies.cloneWithRows(data),
        });
      },
    });
  }

  /**
   * Fired when component will unmount
   * @return void
   */
  componentWillUnmount() {
    // Remove firebase binding to ref
    this.base.removeBinding(this.ref);
  }

  /**
   * Fired when list item is pressed
   * @param {object} Movie object
   * @return {void}
   */
  onPress(movie, item) {
    console.log(item);
    this.props.navigator.push({
      id: 'detail',
      title: movie.title,
      component: SceneDetail,
      passProps: {
        movie,
        date: this.state.firebaseKey,
        id: movie.ids.imdb,
      },
    });
  }

  /**
   * Render loading screen
   * @return {Component}
   */
  loading() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {(Platform.OS === 'ios') ? <ActivityIndicatorIOS style={{ height: 40 }} /> : null}
        {(Platform.OS === 'android') ? (
          <ProgressBarAndroid indeterminate="true" styleAttr="Large" />
        ) : null}
      </View>
    );
  }

  /**
   * Render row method
   * @param {object} Movie object
   * @return {Component}
   */
  renderRow(movie) {
    let item;
    movie.ref = component => (item = component); // eslint-disable-line
    return (
      <TouchableHighlight
        key={movie.id}
        underlayColor="#f8f8ee"
        onPress={() => this.onPress(movie, item)}
      >
        <View>
          <MovieListItem {...movie} />
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {
    const { loading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {loading ? this.loading() : (
          <ListView
            dataSource={this.state.movies}
            renderRow={this.renderRow}
            styles={{ flex: 1 }}
          />
        )}
      </View>
    );
  }
}
