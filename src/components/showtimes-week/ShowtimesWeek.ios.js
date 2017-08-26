import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, SegmentedControlIOS } from 'react-native';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';
import { observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { autobind } from 'core-decorators';
import Showtime from './Showtime';

@inject('ui')
@observer
export default class ShowtimesWeek extends Component {

  static propTypes = {
    ui: PropTypes.object.isRequired,
    showtimes: PropTypes.array,
  }

  static defaultProps = {
    showtimes: [],
  }

  @autobind
  onDayChange(e) {
    this.selectedDay = e.nativeEvent.selectedSegmentIndex;
  }

  @computed
  get showtimesByDay() {
    return groupBy(this.props.showtimes, showtime =>
      new Date(+new Date(showtime.playingAt) - 20000000).toDateString());
  }

  @computed
  get showtimes() {
    const showtimes = get(Object.values(this.showtimesByDay), this.selectedDay, []);
    return Object.entries(groupBy(showtimes, showtime => showtime.cinema.name));
  }

  @computed
  get days() {
    const { date } = this.props.ui;
    return Array.from({ length: 5 })
      .map((n, index) => format(addDays(date, index), 'ddd'));
  }

  @observable
  selectedDay = 0;

  render() {
    if (this.props.showtimes.length === 0) return null;

    return (
      <View>
        <View style={styles.divider} />
        <Text style={styles.heading}>Showtimes</Text>
        <SegmentedControlIOS
          tintColor="#E80054"
          style={styles.select}
          values={this.days}
          selectedIndex={this.selectedDay}
          onChange={this.onDayChange}
        />
        {this.showtimes.map(([cinema, showtimes]) => (
          <View key={cinema}>
            <Text style={styles.cinema}>{cinema}</Text>
            <View style={styles.row}>
              {showtimes.map(showtime => (
                <Showtime key={showtime.id} showtime={showtime} />
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  select: {
    marginBottom: 20,
  },

  divider: {
    marginHorizontal: -30,
    height: 2,
    backgroundColor: '#111',
    marginBottom: 20,
  },

  heading: {
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 17,
  },

  cinema: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.87)',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginRight: -10,
  },
});
