import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { autobind } from 'core-decorators';
import { IShowtime } from 'store/models/Showtime';
import { openUrl } from 'utils/openUrl';
import { format } from 'date-fns';

const styles = require('./Showtime.css');

interface IProps {
  testID?: string;
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
      testID,
    } = this.props;

    return (
      <View style={[styles.host, showtime.disabled ? styles.disabled : {}]} testID={testID}>
        <TouchableOpacity onPress={this.onPress} style={styles.button} disabled={showtime.disabled}>
          <Text style={styles.hour}>
            {format(showtime.playingAt || 0, 'HH:mm')}
          </Text>
        </TouchableOpacity>
        {!!showtime.room && <Text style={styles.room}>{showtime.room}</Text>}
      </View>
    );
  }
}
