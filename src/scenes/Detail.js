import React, {
  Component,
  View,
  Image,
  ScrollView,
  Text,
  Linking,
  StyleSheet,
  PropTypes,
  TouchableHighlight,
} from 'react-native';

import Rebase from 're-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'; // eslint-disable-line
let s = {};

/**
 * Movie Detail Scene
 */
export default class Detail extends Component {

  /**
   * PropTypes
   * @return {object}
   */
  static propTypes = {
    movie: PropTypes.object.isRequired,
    id: PropTypes.string,
    date: PropTypes.string,
  };

  /**
   * Constructor proxy, default state, superbinds.
   * @return {void}
   */
  constructor(...args) {
    super(...args);

    // Create re-base class from Firebase URL
    this.base = Rebase.createClass('https://kvikmyndr.firebaseio.com');

    // Default state
    this.state = {
      movie: this.props.movie,
    };
  }

  /**
   * Fired when component was mounted
   * @return {void}
   */
  componentDidMount() {
    const { date, id } = this.props;

    if (!date || !id) {
      return;
    }

    // Create ref point
    this.ref = this.base.listenTo(`in-show/${date}/${id}`, {
      context: this,
      asArray: false,
      then(movie) {
        this.setState({
          movie,
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
   * Convert minutes to HH:MM
   * @param {number} Runtime in minutes
   * @return {string} HH:MM runtime
   */
  runtime(num) {
    const hours = Math.floor(num / 60);
    const minutes = num - (hours * 60);
    return `${hours} klst ${minutes} mín`;
  }

  /**
   * Group showtimes by cinema
   * @param {array} Array of showtimes
   * @return {array} Array of cinemas of showtimes.
   */
  groupByCinema(arr) {
    const cinemas = [];
    arr.map(d => d.cinema)
    .filter((v, i, self) => self.indexOf(v) === i)
    .forEach(name => {
      cinemas.push(arr.filter(d => d.cinema === name));
    });
    return cinemas;
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {
    const {
      title,
      year,
      genres,
      runtime,
      ratings,
      synoptis,
      directors,
      actors,
      backdropUrl,
      posterUrl,
      showtimes,
    } = this.state.movie;

    const imdbRating = (ratings ? ratings.imdbRating : '?');
    const metascore = ratings && ratings.metascore ? ratings.metascore : null;

    return (
      <View style={s.container}>
        <ScrollView style={{ flex: 1 }}>
          <Image style={s.cover} resizeMode="cover" source={{ uri: `http://image.tmdb.org/t/p/w1000${backdropUrl || posterUrl}` }}>
            <LinearGradient
              start={[0.0, 0.0]}
              end={[0.0, 1.0]}
              locations={[0, 0.5, 1.0]}
              colors={['transparent', 'transparent', '#000']}
              style={{ flex: 1, opacity: 1 }}
            />
            <View style={s.coverContent}>
              <Text style={s.title}>
                {title}
                <Text style={s.year}> ({year})</Text>
              </Text>
              <Text style={s.trailer}>{this.runtime(runtime)}</Text>
            </View>
          </Image>
          <View style={s.detail}>
            <View style={s.bar}>
              {genres ? <Text style={s.genres}>{genres.join(' | ')}</Text> : null}
              <View style={s.row}>
                <Icon name="star" size={14} color="#FAD600" style={{ marginTop: 1 }} />
                <Text style={s.rating}>{imdbRating}/10</Text>
                {metascore ? <Text style={s.metascore}>{metascore}</Text> : null}
                {metascore ? <Text style={s.runtime}>Metascore</Text> : null}
              </View>
            </View>
            {synoptis ? <Text style={s.label}>Söguþráður</Text> : null}
            {synoptis ? <Text style={s.synoptis}>{synoptis.replace(/\n/g, ' ')}</Text> : null}
            {directors && directors.length > 0 ? (
              <Text style={s.directors}>
                <Text style={s.bold}>Leikstjórn: </Text>
              {directors.join(', ')}</Text>
            ) : null}
            {actors && actors.length > 0 ? (
              <Text style={s.actors}>
                <Text style={s.bold}>Leikarar: </Text>
                {actors.slice(0, 5).join(', ')}
              </Text>
            ) : null}
          </View>
          <View style={s.showtimes}>
            {this.groupByCinema(showtimes).map((cinema, ci) => (
              <View key={`cinema_${ci}`} style={s.showtimeGroup}>
                <Text style={s.showtimeCinema}>{cinema[0].cinema}</Text>
                <View style={s.showtimeItems}>
                  {cinema.map((showtime, si) => (
                    <TouchableHighlight
                      key={`showtime_${si}`}
                      underlayColor="#f8f8ee"
                      onPress={() => Linking.openURL(showtime.ticketUrl)}
                    >
                      <View style={s.showtimeItem}>
                        <Text style={s.showtimeHour}>{showtime.hour}</Text>
                        <Text style={s.showtimeHall}>{showtime.hall}</Text>
                        {showtime.flags ? showtime.flags.map((flag, fi) => (
                          <Text
                            key={`flag_${fi}`}
                            style={[s.showtimeFlag, s[`showtimeFlag_${flag}`]]}
                          >
                            {flag}
                          </Text>
                        )) : null}
                      </View>
                    </TouchableHighlight>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

/**
 * @const {StyleSheet} Component styles
 */
s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  cover: {
    flex: 1,
    position: 'relative',
    height: 200,
  },

  coverContent: {
    position: 'absolute',
    bottom: 12,
    left: 10,
  },

  title: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 21,
    fontWeight: '300',
  },

  year: {
    backgroundColor: 'transparent',
    color: '#eee',
    fontSize: 13,
    fontWeight: '300',
  },

  trailer: {
    backgroundColor: 'transparent',
    color: '#fff',
  },

  bar: {
    marginBottom: 12,
  },

  genres: {
    fontSize: 13,
    fontWeight: '300',
    color: '#777',
  },

  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },

  bold: {
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    marginTop: 5,
  },

  runtime: {
    fontSize: 13,
    fontWeight: '300',
    color: '#1a1a1a',
    marginRight: 8,
  },

  rating: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
    marginRight: 8,
    marginTop: 1,
  },

  metascore: {
    backgroundColor: '#eee',
    paddingTop: 1,
    paddingBottom: 0,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },

  synoptis: {
    marginBottom: 12,
  },

  detail: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  actors: {
    paddingBottom: 5,
  },

  directors: {
    paddingBottom: 5,
  },

  showtimes: {
    padding: 12,
    borderTopWidth: 12,
    borderTopColor: '#f8f8f8',
  },

  showtimeGroup: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
    paddingBottom: 12,
  },

  showtimeCinema: {
    flex: 1,
    fontWeight: '500',
  },

  showtimeItems: {
    flex: 1,
    marginTop: -3,
  },

  showtimeItem: {
    flexDirection: 'row',
    padding: 3,
  },

  showtimeHour: {
    paddingRight: 6,
    fontSize: 16,
    fontWeight: '300',
  },

  showtimeHall: {
    color: '#666',
    fontSize: 15,
    fontWeight: '300',
  },

  showtimeFlag: {
    paddingLeft: 4,
  },
});
