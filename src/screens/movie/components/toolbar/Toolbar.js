import React, { Component } from 'react';
import { Platform, StyleSheet, View, Animated, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import { TOOLBAR_HEIGHT } from '../../Movie';
import { COLOR } from '../../../../theme';

const STATUSBAR_HEIGHT = Platform.select({ android: 0, ios: 20 });

export default class Toolbar extends Component {

  static propTypes = {
    movie: PropTypes.object.isRequired,
    scrollY: PropTypes.object.isRequired,
    onBackPress: PropTypes.func,
    onTrailerPress: PropTypes.func,
  }

  static defaultProps = {
    onBackPress: undefined,
    onTrailerPress: undefined,
  }

  render() {
    const { movie, scrollY, onBackPress, onTrailerPress } = this.props;
    const TOOLBAR_KICK_IN_Y = 100;
    const opacity = scrollY.interpolate({
      inputRange: [TOOLBAR_KICK_IN_Y, TOOLBAR_KICK_IN_Y + 40],
      outputRange: [0, 1],
    });
    const animatedTitle = {
      transform: [{
        translateY: scrollY.interpolate({
          extrapolate: 'clamp',
          inputRange: [TOOLBAR_KICK_IN_Y, TOOLBAR_KICK_IN_Y + 40],
          outputRange: [TOOLBAR_HEIGHT, 0],
        }),
      }],
    };

    return (
      <View style={styles.flex}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.background, { opacity }]}>
          <Animated.Text style={[styles.title, animatedTitle]}>{movie.title}</Animated.Text>
        </Animated.View>
        {Platform.OS === 'ios' && (
          <View style={[StyleSheet.absoluteFill, styles.content]}>
            <TouchableOpacity onPress={onBackPress} style={[styles.button, styles.buttonLeft]}>
              <Image
                source={require('../../../../images/icons/back.png')}
                style={styles.buttonBack}
              />
            </TouchableOpacity>
            <View style={styles.flex} />
            {onTrailerPress && (
              <TouchableOpacity
                onPress={onTrailerPress}
                style={[styles.button, styles.buttonRight]}
              >
                <Image
                  source={require('../../../../images/icons/play-circle.png')}
                  style={styles.buttonTrailer}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  background: {
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: COLOR.toolbarBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  content: {
    paddingTop: STATUSBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 130,
  },

  button: {
    width: 64,
    height: TOOLBAR_HEIGHT - STATUSBAR_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  buttonBack: {
    // iOS back button is on arbitary position
    marginLeft: -13,
  },

  buttonTrailer: {
    // This icon is exported weirdly
    marginBottom: 2,
  },

  buttonLeft: {
    alignItems: 'flex-start',
  },

  buttonRight: {
    alignItems: 'flex-end',
  },

  title: {
    textAlign: 'center',
    fontSize: 17,
    color: COLOR.text,
  },
});
