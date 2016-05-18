import React, {
  Component,
  View,
  Text,
  Image,
  StyleSheet,
  PropTypes,
} from 'react-native';
import _uniq from 'lodash/uniq';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

/**
 * Component that renders each row item
 */
export default class MovieListItem extends Component {

  /**
   * PropTypes
   * @return {object}
   */
  static propTypes = {
    posterUrl: PropTypes.string,
    title: PropTypes.string,
    year: PropTypes.number,
    runtime: PropTypes.number,
    ratings: PropTypes.object,
    votes: PropTypes.number,
    showtimes: PropTypes.array,
  };

  /**
   * Convert minutes to HH:MM
   * @param {number} Runtime in minutes
   * @return {string} HH:MM runtime
   */
  runtime(num) {
    const ori = Number(num);
    const hours = Math.floor(num / 60);
    const minutes = ori - (hours * 60);

    let minutesString = '';

    if (minutes > 0) {
      minutesString = ` ${minutes} mín`;
    }

    return `${hours} klst${minutesString}`;
  }

  /**
   * Convert array of showtimes to grouped hours
   * @param {array} Array of showtimes
   * @return {array} Array of hours
   */
  asHours(arr) {
    return _uniq(arr
    .map(i => i.hour.split(i.hour.match(/\.|:/).pop()).map(Number).reduce((a, b) => (a * 60) + b))
    .filter((val, i, self) => {
      const nearest = self.filter(d => d < val).sort((a, b) => a - b);
      return (nearest.length <= 1) || (val - nearest.pop()) > 15;
    })
    .sort((a, b) => a - b)
    .map(n => {
      const h = Math.floor(n / 60);
      const m = n - (h * 60);
      return [h, m].map(d => d < 10 ? `0${d}` : d).join(':');
    }));
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {
    const {
      posterUrl,
      title,
      runtime,
      ratings,
      showtimes,
    } = this.props;

    const imdbRating = (ratings ? ratings.imdbRating : '--');

    return (
      <View style={s.item}>
        <Image id="poster" style={s.poster} source={{ uri: `http://image.tmdb.org/t/p/w500${posterUrl}` }} />
        <View style={s.detail}>
          <Text id="title" style={s.title}>{title}</Text>
          <View style={[s.vertical, { flex: 1 }]}>
            <Text id="runtime" style={s.runtime}>{this.runtime(runtime)}</Text>
            <Icon name="star" size={14} color="#FAD600" />
            <Text style={s.rating}>{imdbRating}/10</Text>
          </View>
          {showtimes ? (
            <View id="showtimes" style={s.showtimes}>
              {this.asHours(showtimes).map((hour, i) => (
                <Text style={s.showtime} key={`hour_${i}`}>{hour}</Text>
              ))}
            </View>
          ) : null}
        </View>
        <Entypo style={s.chevron} name="chevron-thin-right" size={18} color="#ddd" />
      </View>
    );
  }
}

/**
 * @const {StyleSheet} Component styles
 */
const s = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },

  detail: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },

  vertical: {
    flexDirection: 'row',
    paddingBottom: 5,
  },

  title: {
    fontSize: 21,
    fontWeight: '300',
    color: '#1a1a1a',
    marginBottom: 2,
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
  },

  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999',
    marginBottom: 2,
  },

  showtimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -3,
  },

  showtime: {
    fontSize: 12,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    backgroundColor: '#eee',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 5,
    paddingLeft: 5,
    textAlign: 'center',
  },

  chevron: {
    alignSelf: 'center',
  },

  poster: {
    width: 80,
    height: 125,
  },
});
