import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import { autobind } from 'core-decorators';
import isAfter from 'date-fns/is_after';
import openUrl from '../../utils/openUrl';

@inject('ui')
@observer
export default class Poster extends Component {

  static propTypes = {
    showtime: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
  }

  @autobind
  onPress() {
    const { ticketUrl } = this.props.showtime;
    openUrl(ticketUrl);
  }

  @computed
  get isAfter() {
    const { ui, showtime } = this.props;
    return isAfter(ui.date, showtime.playingAt);
  }

  render() {
    const { showtime } = this.props;
    return (
      <View style={[styles.host, this.isAfter ? styles.disabled : {}]}>
        <TouchableOpacity onPress={this.onPress} style={styles.button} disabled={this.isAfter}>
          <Text style={styles.hour}>
            {(new Date(showtime.playingAt)).toTimeString().substr(0, 5)}
          </Text>
        </TouchableOpacity>
        {!!showtime.room && <Text style={styles.room}>{showtime.room}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: -1,
    minWidth: 96,
    marginBottom: 10,
    marginRight: 10,
  },

  button: {
    height: 30,
    backgroundColor: '#555555',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,

    // iOS shadow
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000000',
    shadowRadius: 2,
  },

  disabled: {
    opacity: 0.5,
  },

  hour: {
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#FFFFFF',
  },

  room: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.6,
    textAlign: 'center',
  },
});
