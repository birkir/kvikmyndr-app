import * as React from 'react';
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { autobind } from 'core-decorators';
import { IShowtime } from 'store/models/Showtime';
import { openUrl } from 'utils/openUrl';
const styles = require('./Showtime.css');

interface IProps {
  testID?: string;
  disabled?: boolean;
  showtime: IShowtime;
}

export default class Showtime extends React.PureComponent<IProps, {}> {

  @autobind
  onPress() {
    const { ticketUrl } = this.props.showtime;
    if (!ticketUrl) {
      return null;
    }

    return openUrl(ticketUrl);
  }

  render() {
    const {
      showtime,
      disabled = false,
      testID,
    } = this.props;

    return (
      <View style={[styles.host, disabled ? styles.disabled : {}]} testID={testID}>
        <TouchableOpacity onPress={this.onPress} style={styles.button} disabled={disabled}>
          <Text style={styles.hour}>
            {(new Date(showtime.playingAt || 0)).toTimeString().substr(0, 5)}
          </Text>
        </TouchableOpacity>
        {!!showtime.room && <Text style={styles.room}>{showtime.room}</Text>}
      </View>
    );
  }
}
