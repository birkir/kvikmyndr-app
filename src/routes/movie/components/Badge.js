import React, { PropTypes } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

export default function Badge({ type, onPress, rating }) {

  const Root = (onPress ? TouchableOpacity : View);
  const isMeta = (type === 'metascore');

  return (
    <Root style={s.host} onPress={onPress}>
      {rating ? <Text style={s.rating}>{rating}</Text> : null}
      <View style={isMeta ? s.circle : s.border}>
        <Text style={[s.text, s[`${type}Text`]]}>
          {isMeta ? 'm' : 'IMDb'}
        </Text>
      </View>
    </Root>
  );
}

Badge.propTypes = {
  type: PropTypes.oneOf(['imdb', 'metascore']),
  onPress: PropTypes.func,
  rating: PropTypes.string,
};

Badge.defaultProps = {
  type: undefined,
  onPress: () => {},
  rating: undefined,
};

const s = StyleSheet.create({

  host: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },

  rating: {
    fontSize: 25,
    color: '#eee',
    marginRight: 6,
  },

  border: {
    height: 20,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  circle: {
    height: 20,
    width: 20,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 10,
    transform: [
      { rotate: '-45deg' },
    ],
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    ...Platform.select({
      ios: {
        fontFamily: 'AvenirNextCondensed-Bold',
        fontSize: 14,
      },
      android: {
        fontFamily: 'sans-serif-condensed',
        fontWeight: 'bold',
        marginTop: -2,
      },
    }),
    letterSpacing: -1,
    color: '#eee',
  },

  imdbText: {
  },

  metascoreText: {
    marginTop: Platform.select({ android: -4, ios: -1 }),
  },

});
