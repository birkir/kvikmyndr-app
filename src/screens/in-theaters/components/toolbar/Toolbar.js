import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Animated, View, TouchableOpacity } from 'react-native';
import { observable, computed } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { autobind } from 'core-decorators';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';

console.ignoredYellowBox = ['RCTBatchedBridge'];

@inject('ui')
@observer
export default class Toolbar extends Component {

  static propTypes = {
    ui: PropTypes.object.isRequired,
  }

  @autobind
  onDayPress(i) {
    this.selectedDay = i;
    this.setOffsetLeft();
  }

  @autobind
  onDayLayout(i, e) {
    this.layoutDays.set(i, e.nativeEvent.layout.width);
  }

  @autobind
  onScrollEnd(e) {
    const { x } = e.nativeEvent.contentOffset;
    let left = 0;
    const offsets = this.layoutDays.entries()
      .sort((a, b) => a[0] - b[0])
      .map((n) => {
        const to = left;
        left += n[1];
        return to;
      });
    const selected = offsets.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a));
    this.selectedDay = offsets.findIndex(val => val === selected) || 0;
    this.scrollTo(selected);
  }

  @computed
  get days() {
    const { date } = this.props.ui;
    return Array.from({ length: 5 })
      .map((n, index) => format(addDays(date, index), 'ddd'));
  }


  @computed
  get gutterWidth() {
    return (this.layoutDays.values().reduce((a, b) => a + b, 0)) / 2;
  }

  @autobind
  setOffsetLeft() {
    const { selectedDay } = this;
    const toValue = this.layoutDays.entries()
      .sort((a, b) => a[0] - b[0])
      .reduce((acc, [index, width]) => (+index < selectedDay ? acc + width : acc), 0);
    this.scrollTo(toValue);
  }

  @autobind
  scrollTo(val) {
    const { selectedDay } = this;
    this.scrollView._component.scrollTo({ x: val }); // eslint-disable-line
    this.props.ui.inTheatersHeader.daysFromNow = selectedDay;
  }

  @observable
  layoutDays = new Map();

  @observable
  selectedDay = 0;

  scrollX = new Animated.Value(0);

  render() {
    let start = 0;
    const animated = this.days.map((_, i) => {
      const width = this.layoutDays.get(i) || 0;
      const from = start - (width / 1.5);
      const active = start;
      const to = start + (width / 1.5);
      start += width;
      return {
        opacity: this.scrollX.interpolate({
          inputRange: [from, active, to],
          outputRange: [0.75, 1, 0.75],
        }),
        transform: [{
          scale: this.scrollX.interpolate({
            inputRange: [from, active, to],
            outputRange: [1, 1.1, 1],
            extrapolate: 'clamp',
          }),
        }],
      };
    });
    return (
      <View style={styles.host}>
        <Animated.ScrollView
          ref={(ref) => { this.scrollView = ref; }}
          style={styles.slider}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScrollEndDrag={this.onScrollEnd}
          onMomentumScrollBegin={this.onScrollEnd}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
            { useNativeDriver: true },
          )}
          horizontal
        >
          <View style={[styles.gutter, { width: this.gutterWidth + 20 }]} />
          {this.days.map((day, i) => (
            <TouchableOpacity
              key={day}
              onPress={() => this.onDayPress(i)}
              style={styles.item}
            >
              <Animated.Text
                onLayout={e => this.onDayLayout(i, e)}
                style={[styles.text, animated[i]]}
              >
                {day}
              </Animated.Text>
            </TouchableOpacity>
          ))}
          <View style={[styles.gutter, { width: this.gutterWidth - 5 }]} />
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 46,
  },

  slider: {
    flexDirection: 'row',
    // backgroundColor: 'red',
  },

  gutter: {
    // backgroundColor: 'blue',
  },

  item: {
    justifyContent: 'center',
  },

  text: {
    fontSize: 16,
    color: '#FFF',
    paddingHorizontal: 6,
  },
});
