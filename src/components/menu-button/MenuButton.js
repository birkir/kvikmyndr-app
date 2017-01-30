import React, { Component } from 'react';
import { TouchableOpacity, Platform, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import store from 'store';

export default class MenuButton extends Component {

  onPress() {
    store.UI.isDrawerOpen = true;
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress} style={s.host}>
        <Icon name="menu" size={24} color="#fff" />
      </TouchableOpacity>
    );
  }
}

const s = StyleSheet.create({
  host: {
    height: 44,
    position: 'absolute',
    justifyContent: 'center',
    top: Platform.select({ ios: 0, android: 8 }),
    left: 2,
    padding: 8,
  },
});
