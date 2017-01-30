/* eslint react/no-array-index-key: 0 */
import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { autobind } from 'core-decorators';
import moment from 'moment';
import _toArray from 'lodash/toArray';
import store from 'store';
import ShowtimesItem from './ShowtimesItem';

@autobind
export default class ShowtimesList extends Component {

  static propTypes = {
    items: PropTypes.array, // eslint-disable-line
    date: PropTypes.string, // eslint-disable-line
  };

  static defaultProps = {
    items: [],
  };

  /**
   * Group showtimes by cinema
   * @param {array} Array of showtimes
   * @return {array} Array of cinemas of showtimes.
   */
  groupByCinema(arr) {
    const { width } = Dimensions.get('window');
    const pixelDensity = PixelRatio.get();
    const w = width * pixelDensity;
    const n = Math.ceil(w / 350);
    const cinemas = [];
    arr.map(d => d.cinema)
    .filter((v, i, self) => self.indexOf(v) === i)
    .forEach((name) => {
      cinemas.push(
        arr.filter(d => d.cinema === name)
        .map(item => ({
          ...item,
          flags: _toArray(item.flags),
          date: moment(`${this.props.date} ${item.hour.replace(/\./, ':')}:00`),
        })),
      );
    });

    return cinemas.map(item => this.groupByN(item, n));
  }

  /**
   * Group array to chunks
   * @param {array} Array to chunk
   * @param {number} Number of items in each chunk.
   * @return {array} 2-dimensional array
   */
  groupByN(arr, n) {
    let i;
    let j;
    const res = [];
    for (i = 0, j = arr.length; i < j; i += n) {
      res.push(arr.slice(i, i + n));
    }
    const last = res[res.length - 1];
    last.push(...(new Array(n - last.length)).fill(null));
    return res;
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {
    const { items } = this.props;

    if (items.length === 0) {
      return (
        <View style={s.nothing}>
          <Text style={s.nothingText}>{store.UI.i18n.NO_SHOWS}</Text>
        </View>
      );
    }

    if (!items) {
      return null;
    }

    if (!this.grouped) {
      // Only group once, it's a heavy task.
      this.grouped = this.groupByCinema(_toArray(items));
    }

    // Process cinema list on each tick
    const cinemas = this.grouped;

    return (
      <View style={s.host}>
        {cinemas.map(cinema => (
          <View key={cinema[0][0].cinema} style={s.group}>
            <Text style={s.cinema}>{cinema[0][0].cinema}</Text>
            {cinema.map((citems, gi) => (
              <View style={s.items} key={`group_${gi}`}>
                {citems.map((item, si) => (
                  <ShowtimesItem
                    key={`showtime_${si}`}
                    {...item}
                  />
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    marginTop: 28,
    paddingHorizontal: 30,
  },

  group: {
    marginBottom: 15,
  },

  items: {
    flexDirection: 'row',
  },

  cinema: {
    fontWeight: '300',
    fontSize: 21,
    color: '#aaa',
    marginBottom: 5,
  },

  nothing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nothingText: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
  },
});
