import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Account extends Component {

  render() {
    return (
      <View style={styles.host}>
        <Text style={styles.soon}>Coming soon</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  soon: {
    fontSize: 16,
    color: 'white',
  },
});
