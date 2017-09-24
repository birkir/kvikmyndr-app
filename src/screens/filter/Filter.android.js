import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Animated, Picker, View, Text, Slider, TouchableNativeFeedback, TouchableOpacity, TimePickerAndroid } from 'react-native';
import { autobind } from 'core-decorators';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import withCinemas from '../../store/queries/withCinemas';

@inject('ui')
@withCinemas
@observer
export default class Filter extends Component {

  static propTypes = {
    ui: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    cinemas: PropTypes.object.isRequired,
    onApply: PropTypes.func,
  }

  static defaultProps = {
    onApply() {},
  }

  constructor(props) {
    super(props);
    const { sortBy, cinemas } = props.ui.inTheatersFilter;
    this.sortBy = sortBy;
    this.cinema = cinemas && cinemas.length > 0 ? cinemas[0] : '';
  }

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.backdropOpacity, { toValue: 1, useNativeDriver: true, duration: 330 }),
      Animated.timing(this.dialogOpacity, { toValue: 1, useNativeDriver: true, duration: 220 }),
    ]).start();
  }

  @autobind
  onSortByChange(value) {
    this.sortBy = value;
  }

  @autobind
  onCinemaByChange(value) {
    this.cinema = value;
  }

  @autobind
  async onHourFromPress() {
    const hours = await this.promptTimeDialog(this.hoursFrom);
    this.hoursFrom = hours;
  }

  @autobind
  async onHourToPress() {
    const hours = await this.promptTimeDialog(this.hoursTo);
    this.hoursTo = hours;
  }

  @autobind
  async onApplyPress() {
    const { inTheatersFilter } = this.props.ui;

    // Store sort by filter
    inTheatersFilter.sortBy = this.sortBy;

    // TODO: allow multi selection of cinema
    // undefined = all cinemas
    if (this.cinema === '') {
      inTheatersFilter.cinemas = [];
    } else {
      inTheatersFilter.cinemas = [this.cinema];
    }

    this.props.onApply();

    // Done
    Animated.parallel([
      Animated.timing(this.backdropOpacity, { toValue: 0, useNativeDriver: true, duration: 330 }),
      Animated.timing(this.dialogOpacity, { toValue: 0, useNativeDriver: true, duration: 220 }),
    ]).start(() => {
      this.props.navigator.dismissModal();
    });
  }

  async promptTimeDialog(time) {
    try {
      const [hour, minute] = time.split(':').map(Number);
      const res = await TimePickerAndroid.open({ hour, minute, is24Hour: true });
      if (res.action !== TimePickerAndroid.dismissedAction) {
        return `${res.hour < 10 ? '0' : ''}${res.hour}:${res.minute < 10 ? '0' : ''}${res.minute}`;
      }
    } catch (err) {
      console.warn('Cannot open date picker', err.message);
    }
    return time;
  }

  @observable
  sortBy = 'popularity';

  @observable
  cinema = 'all';

  @observable
  hoursFrom = '00:00';

  @observable
  hoursTo = '00:00';

  backdropOpacity = new Animated.Value(0);
  dialogOpacity = new Animated.Value(0);

  render() {
    const { cinemas } = this.props;
    const Touchable = Platform.select({ android: TouchableNativeFeedback, ios: TouchableOpacity });
    return (
      <Animated.View style={[{ opacity: this.backdropOpacity }, styles.host]}>
        <Animated.View style={[{ opacity: this.dialogOpacity }, styles.dialog]}>
          <Text style={styles.title}>Filter movies</Text>
          <View style={styles.content}>
            <View style={styles.row}>
              <View style={styles.label}>
                <Text style={styles.labelText}>Sort by</Text>
              </View>
              <View style={styles.control}>
                <Picker
                  style={styles.picker}
                  selectedValue={this.sortBy}
                  onValueChange={this.onSortByChange}
                  mode="dropdown"
                >
                  <Picker.Item label="Popularity" value="popularity" />
                  <Picker.Item label="Title" value="title" />
                  <Picker.Item label="Rating" value="rating" />
                  <Picker.Item label="Runtime" value="runtime" />
                </Picker>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.label}>
                <Text style={styles.labelText}>Cinema</Text>
              </View>
              <View style={styles.control}>
                {cinemas.loading
                  ? <Text>Loading</Text>
                  : (
                    <Picker
                      style={styles.picker}
                      selectedValue={this.cinema}
                      onValueChange={this.onCinemaByChange}
                      mode="dropdown"
                    >
                      <Picker.Item key="all" label="All" value="" />
                      {cinemas.items.map(cinema => (
                        <Picker.Item key={cinema.id} label={cinema.name} value={cinema.id} />
                      ))}
                    </Picker>
                  )
                }
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.label}>
                <Text style={styles.labelText}>Rating</Text>
              </View>
              <View style={styles.control}>
                <Slider />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.label}>
                <Text style={styles.labelText}>Showtimes</Text>
              </View>
              <View style={styles.control}>
                <View style={styles.hours}>
                  <Touchable onPress={this.onHourFromPress}>
                    <View style={styles.hour}>
                      <Text style={styles.hourLabel}>{this.hoursFrom}</Text>
                    </View>
                  </Touchable>
                  <Text style={styles.to}>to</Text>
                  <Touchable onPress={this.onHourToPress}>
                    <View style={styles.hour}>
                      <Text style={styles.hourLabel}>{this.hoursTo}</Text>
                    </View>
                  </Touchable>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.toolbar}>
            <Touchable onPress={this.onApplyPress}>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}>APPLY</Text>
              </View>
            </Touchable>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(24, 24, 24, 0.75)',
  },

  dialog: {
    minWidth: 300,
    minHeight: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    elevation: 24,
  },

  title: {
    ...Platform.select({ android: { fontFamily: 'sans-serif-medium' } }),
    fontSize: 20,
    color: 'rgba(0,0,0,0.87)',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 20,
  },

  content: {
    marginHorizontal: 24,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
  },

  label: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  labelText: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.6)',
  },

  control: {
    width: 160,
  },

  picker: {
    marginRight: -4,
  },

  hours: {
    flexDirection: 'row',
    paddingLeft: 0,
    paddingRight: 16,
  },

  to: {
    flex: 1,
    textAlign: 'center',
    paddingTop: 8,
    minWidth: 25,
  },

  hour: {
    height: 36,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },

  hourLabel: {
    ...Platform.select({ android: { fontFamily: 'sans-serif-medium' } }),
    backgroundColor: 'transparent',
    color: '#009688',
    fontWeight: '400',
  },

  button: {
    height: 36,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },

  buttonLabel: {
    ...Platform.select({ android: { fontFamily: 'sans-serif-medium' } }),
    backgroundColor: 'transparent',
    color: '#009688',
    fontWeight: '400',
  },

  toolbar: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 8,
  },
});
