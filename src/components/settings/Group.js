import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

export default class Group extends Component {

  static propTypes = {
    legend: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    legend: undefined,
    children: undefined,
  }

  render() {
    const { legend, children } = this.props;
    return (
      <View style={styles.host}>
        {!!legend && <Text style={styles.legend}>{legend}</Text>}
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    marginVertical: 20,
  },
  legend: {
    fontSize: 16,
  },
});
