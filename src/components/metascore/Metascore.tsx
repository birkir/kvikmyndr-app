import * as React from 'react';
import { View, Text, Image, TouchableOpacity, GestureResponderEvent } from 'react-native';
const styles = require('./Metascore.css');

interface IProps {
  testID?: string;
  rating: number;
  onPress?(event: GestureResponderEvent): void;
}

export default class Metascore extends React.PureComponent<IProps, {}> {

  render() {
    const {
      rating,
      onPress,
      testID,
    } = this.props;

    if (!rating) {
      return null;
    }

    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress} testID={testID}>
        <View style={styles.host}>
          <Text style={styles.rating}>{rating}</Text>
          <Image source={require('../../assets/icons/metacritic.png')} style={styles.logo} />
        </View>
      </TouchableOpacity>
    );
  }
}
