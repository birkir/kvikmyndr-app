import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { autobind } from 'core-decorators';

export default class MenuItem extends Component {

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.any,
    isActive: PropTypes.bool,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    title: undefined,
    icon: undefined,
    isActive: false,
    onPress: undefined,
  }

  @autobind
  onPress() {
    this.props.onPress(this.props);
  }

  render() {
    const { title, icon, onPress, isActive } = this.props;
    return (
      <TouchableOpacity onPress={this.onPress} disabled={!onPress}>
        <View style={styles.host}>
          <View style={styles.icon}>
            <Image source={icon} style={[styles.image, isActive ? styles.imageActive : {}]} />
          </View>
          <Text style={[styles.text, isActive ? styles.textActive : {}]}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 48,
    height: 48,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 30,
    height: 30,
    tintColor: '#787878',
  },

  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#787878',
  },

  imageActive: {
    tintColor: '#FF2244',
  },

  textActive: {
    color: '#FF2244',
  },
});
