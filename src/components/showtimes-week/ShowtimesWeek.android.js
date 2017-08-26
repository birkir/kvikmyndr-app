import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { TabLayout } from 'react-native-android-kit';
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
  onLayout(e, i) {
    this.pages.set(i, e.nativeEvent.layout.height + 50);
    if (i === 0) {
      this.height.setValue(e.nativeEvent.layout.height + 50);
    }
  }

  @autobind
  onPageSelected(e) {
    this.height.setValue(this.pages.get(e.nativeEvent.position));
  }

  @computed
  get showtimesByDay() {
    return groupBy(this.props.showtimes, showtime =>
      new Date(+new Date(showtime.playingAt) - 20000000).toDateString());
  }

  @computed
  get days() {
    const { date } = this.props.ui;
    return Array.from({ length: 5 })
      .map((n, index) => format(addDays(date, index), 'ddd'));
  }

  showtimesByCinema(day) {
    const showtimes = get(Object.values(this.showtimesByDay), day, []);
    return Object.entries(groupBy(showtimes, showtime => showtime.cinema.name));
  }

  height = new Animated.Value(1000);

  @observable
  pages = new Map();

  render() {
    if (this.props.showtimes.length === 0) return null;
    const { height } = this;
    return (
      <View>
        <Animated.View style={[{ height }]}>
          <TabLayout
            style={styles.tabs}
            backgroundColor="#000000"
            indicatorTabColor="#FF2244"
            indicatorTabHeight={2}
            scrollable={false}
            center={false}
            height={48}
            onPageSelected={this.onPageSelected}
          >
            {this.days.map((day, i) => (
              <TabLayout.Item
                key={day}
                text={day.toUpperCase()}
                textSize={14}
                textColor="#FFFFFF"
                selectedTextColor="#FF2244"
              >
                <View style={styles.page} onLayout={e => this.onLayout(e, i)}>
                  {this.showtimesByCinema(i).map(([cinema, showtimes]) => (
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
              </TabLayout.Item>
            ))}
          </TabLayout>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  tabs: {
    marginHorizontal: -30,
    flex: 1,
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

  page: {
    padding: 20,
    // position: 'absolute',
  },

  // toolbar: {
  //   height: 48,
  // },
});
