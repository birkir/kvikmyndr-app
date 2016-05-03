import React, {
  Component,
  Platform,
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


  onPress(movie) {
    this.props.navigator.push({
      id: 'detail',
      title: movie.title,
      component: SceneDetail,
      passProps: {
        movie,
        date: this.state.firebaseKey,
      },
    });
  }

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

  renderRow(movie) {
    return (
      <TouchableHighlight
        key={movie.id}
        underlayColor="#f8f8ee"
        onPress={() => this.onPress(movie)}
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
