import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default class Item extends Component {

  static propTypes = {
    label: PropTypes.string,
    isSelected: PropTypes.bool,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    label: undefined,
    isSelected: undefined,
    onPress: undefined,
  }

  render() {
    const { label, isSelected, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.host} onPress={onPress} disabled={!onPress}>
        <View style={styles.item}>
          <Text style={styles.label}>{label}</Text>
          {isSelected && <View style={styles.checkbox} />}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    marginVertical: 20,
  },

  item: {
    height: 32,
    width: '100%',
    flexDirection: 'row',
  },

  label: {
    fontSize: 16,
    color: '#FFF',
    flex: 1,
  },

  checkbox: {
    width: 16,
    height: 16,
    backgroundColor: 'orange',
  },
});
