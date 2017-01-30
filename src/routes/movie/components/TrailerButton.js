import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

export default class TrailerButton extends Component {

  static propTypes = {
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onPress: () => {},
  };

  render() {
    const { onPress } = this.props;
    return (
      <TouchableOpacity style={s.host} onPress={onPress}>
        <Icon
          name="controller-play"
          size={16}
          color="#fff"
          style={s.icon}
        />
      </TouchableOpacity>
    );
  }
}

const s = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 30,
    right: 10,
    width: 25,
    height: 25,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    marginLeft: 1,
  },
});
