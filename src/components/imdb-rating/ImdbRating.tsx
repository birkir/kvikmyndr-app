import * as React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { openUrl } from 'utils/openUrl';
import { autobind } from 'core-decorators';
const styles = require('./ImdbRating.css');

interface IProps {
  testID?: string;
  imdbId?: string;
  rating: number;
}

export default class ImdbRating extends React.PureComponent<IProps, {}> {

  @autobind
  onPress() {
    const { imdbId } = this.props;
    return openUrl(`http://www.imdb.com/title/${imdbId}`);
  }

  render() {
    const {
      rating,
      imdbId,
      testID,
    } = this.props;

    if (!rating) {
      return null;
    }

    return (
      <TouchableOpacity onPress={this.onPress} disabled={!imdbId} testID={testID}>
        <View style={styles.host}>
          <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          <Image source={require('../../assets/icons/imdb.png')} style={styles.logo} />
        </View>
      </TouchableOpacity>
    );
  }
}
