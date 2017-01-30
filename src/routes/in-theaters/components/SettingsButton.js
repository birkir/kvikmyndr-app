import React from 'react';
import { TouchableOpacity, Platform, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import store from 'store';

function SettingsButton() {
  return (
    <TouchableOpacity style={s.host} onPress={store.UI.toggleInTheatersFilterSheetOpen}>
      <Icon name="cog" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  host: {
    height: 44,
    position: 'absolute',
    justifyContent: 'center',
    top: Platform.select({ ios: 0, android: 8 }),
    right: 2,
    padding: 8,
  },
});

export default SettingsButton;
