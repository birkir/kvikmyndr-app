import React, { PropTypes } from 'react';
import { Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { Actions } from 'react-native-mobx';
import Icon from 'react-native-vector-icons/Entypo';

export default function BackButton({ onPress, isNavbar }) {
  return (
    <TouchableOpacity style={isNavbar ? s.navbar : s.host} onPress={onPress || Actions.pop}>
      <Icon name="chevron-thin-left" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

BackButton.propTypes = {
  onPress: PropTypes.func,
  isNavbar: PropTypes.bool,
};

BackButton.defaultProps = {
  onPress: undefined,
  isNavbar: false,
};

const s = StyleSheet.create({
  navbar: {
    height: 44,
    position: 'absolute',
    justifyContent: 'center',
    top: Platform.select({ ios: 0, android: 8 }),
    left: 2,
    padding: 8,
  },
  host: {
    position: 'absolute',
    top: 30,
    left: 10,
    backgroundColor: 'transparent',
  },
});
