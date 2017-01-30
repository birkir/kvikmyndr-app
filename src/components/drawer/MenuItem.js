import React, { Component, PropTypes } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { autobind } from 'core-decorators';
import { Actions } from 'react-native-mobx';

export default class MenuItem extends Component {

  static propTypes = {
    title: PropTypes.string,
    to: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    to: '',
  };

  @autobind
  onPress() {
    Actions[this.props.to]({ type: 'replace' });
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress} style={s.host}>
        <Text style={s.text}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

const s = StyleSheet.create({
  host: {
    padding: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#181818',
  },

  text: {
    fontWeight: '300',
    fontSize: 20,
    color: '#fff',
  },
});
