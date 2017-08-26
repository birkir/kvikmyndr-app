import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import PropTypes from 'prop-types';

export default class IMDBRating extends PureComponent {

  static propTypes = {
    rating: PropTypes.number,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    rating: undefined,
    onPress: undefined,
  }

  render() {
    const { rating, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <View style={styles.host}>
          <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          <Image source={require('../../images/icons/imdb.png')} style={styles.logo} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 34,
    height: 18,
    marginLeft: 5,
    tintColor: '#999',
  },

  rating: {
    fontWeight: '200',
    fontSize: 22,
    color: '#BBBBBB',
  },
});
