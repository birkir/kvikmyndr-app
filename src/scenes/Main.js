import React, {
  Component,
  Platform,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  SegmentedControlIOS,
  ProgressBarAndroid,
  ListView,
  PropTypes,
} from 'react-native';
import _pick from 'lodash/pick';
import _mapValues from 'lodash/mapValues';
import Rebase from 're-base';
import MovieListItem from '../components/MovieListItem';
import SceneFilters from './Filters';
import SceneDetail from './Detail';

/**
 * Main Scene
 */
export default class SceneMain extends Component {

  /**
   * PropTypes
   * @return {object}
   */
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  };

  /**
   * Constructor proxy, default state, superbinds.
   * @return {void}
   */
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
      showFilters: false,
      selectedTab: 0,
      date: this.getDate(),
      filters: {
        orderBy: 'Fjölda sýninga',
        cinema: 'Öll kvikmyndahús',
      },
    };

    // Superbinds
    this.onPress = this.onPress.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  /**
   * Fired when component was mounted
   * @return void
   */
  componentDidMount() {
    this.setFirebaseRef();
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
  onPress(movie) {
    this.props.navigator.push({
      id: 'detail',
      title: movie.title,
      component: SceneDetail,
      passProps: {
        movie,
        date: this.state.date,
        id: movie.ids.imdb,
      },
    });
  }

  /**
   * Fired when filters button in navbar is pressed
   * @return {void}
   */
  onFiltersPress() {
    this.props.navigator.push({
      title: 'Stillingar',
      component: SceneFilters,
      passProps: {
        onSave: this.onSave.bind(this),
      },
    });
  }

  onSave(data) {
    this.setState({
      filters: _mapValues(
        _pick(data, [
          'showtime',
          'cinema',
          'orderBy',
        ]),
        arr => [].concat(arr).pop()
      ),
    });
  }

  /**
   * Fired when selected tab is changed
   * @param {Event}
   * @return {void}
   */
  onTabChange(e) {
    const selectedTab = e.nativeEvent.selectedSegmentIndex;
    const date = this.getDate(selectedTab);

    this.setState({
      loading: true,
      selectedTab,
      date,
    });

    this.base.removeBinding(this.ref);
    this.setFirebaseRef();
  }

  /**
   * Get date by day
   * @param {int} Day number
   * @return {string} Date as DD-MM-YYYY
   */
  getDate(day = 0) {
    let seconds = (new Date()).getTime();
    seconds += (day * (86400 * 1000));
    return (new Date(seconds)).toISOString().substr(0, 10);
  }

  /**
   * Set active firebase ref based on selected tab
   * @return {void}
   */
  setFirebaseRef() {
    this.ref = this.base.listenTo(`in-show/${this.state.date}`, {
      context: this,
      asArray: true,
      then(data) {
        data.sort((...a) => a.map(b => [].concat(b.showtimes).length).reduce((c, d) => d - c));
        this.setState({
          loading: false,
          movies: this.state.movies.cloneWithRows(data),
        });
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
    const weekdays = ['Sun', 'Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau'];
    const from = (new Date()).getDate() - 1;
    const dates = Array(5).fill()
    .map((_, i) => weekdays[(i + from) % 7]);

    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: 'transparent', padding: 10 }}>
          <SegmentedControlIOS
            enabled
            tintColor="#fff"
            values={dates}
            selectedIndex={this.state.selectedTab}
            onChange={this.onTabChange}
          />
        </View>
        {loading ? this.loading() : (
          <ListView
            enableEmptySections
            dataSource={this.state.movies}
            renderRow={this.renderRow}
            styles={{ flex: 1 }}
          />
        )}
      </View>
    );
  }
}
