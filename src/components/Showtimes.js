import React, {
  Component,
  View,
  Text,
  Linking,
  StyleSheet,
  PropTypes,
  TouchableHighlight,
} from 'react-native';

/**
 * Movie Detail Scene
 */
export default class Showtimes extends Component {

  /**
   * PropTypes
   * @return {object}
   */
  static propTypes = {
    showtimes: PropTypes.array,
  };

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
   * Render showtime item
   * @param {object} Showtime object
   * @param {number} Index in array
   * @return {Component}
   */
  renderShowtime(showtime, i) {
    return (
      <TouchableHighlight
        key={`showtime_${i}`}
        underlayColor="#f8f8ee"
        onPress={() => Linking.openURL(showtime.ticketUrl)}
      >
        <View style={s.item}>
          <Text style={s.hour}>{showtime.hour}</Text>
          <Text style={s.hall}>{showtime.hall}</Text>
          {showtime.flags ? showtime.flags.map((flag, fi) => (
            <Text
              key={`flag_${fi}`}
              style={[s.flag, s[`showtimeFlag_${flag}`]]}
            >
              {flag}
            </Text>
          )) : null}
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {
    const { showtimes } = this.props;
    const cinemas = this.groupByCinema(showtimes);

    return (
      <View style={s.showtimes}>
        {cinemas.map((cinema, ci) => (
          <View key={`cinema_${ci}`} style={s.group}>
            <Text style={s.cinema}>{cinema[0].cinema}</Text>
            <View style={s.items}>
              {cinema.map(this.renderShowtime)}
            </View>
          </View>
        ))}
      </View>
    );
  }
}

/**
 * @const {StyleSheet} Component styles
 */
const s = StyleSheet.create({

  group: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderTopWidth: 12,
    borderTopColor: '#f8f8f8',
  },

  cinema: {
    flex: 1,
    fontWeight: '500',
  },

  items: {
    flex: 1,
    marginTop: -3,
  },

  item: {
    flexDirection: 'row',
    padding: 3,
  },

  hour: {
    paddingRight: 6,
    fontSize: 16,
    fontWeight: '300',
  },

  hall: {
    color: '#666',
    fontSize: 15,
    fontWeight: '300',
  },

  flag: {
    paddingLeft: 4,
  },
});
