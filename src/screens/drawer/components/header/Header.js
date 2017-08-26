import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

export default class Header extends Component {

  static propTypes = {
    onPress: PropTypes.func,
  }

  static defaultProps = {
    onPress: undefined,
  }

  render() {
    const { onPress } = this.props;
    return (
      <View style={styles.host}>
        <TouchableOpacity style={styles.icon} onPress={onPress}>
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </TouchableOpacity>
        <Text style={styles.text}>Bíóhúsið</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  icon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    marginRight: 20,
  },

  bar: {
    width: 20,
    height: 2,
    backgroundColor: '#FFF',
    marginBottom: 3,
  },

  text: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFF',
  },
});
