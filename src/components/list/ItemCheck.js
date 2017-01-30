import React, { Component, PropTypes } from 'react';
import { Text, StyleSheet } from 'react-native';
import { autobind } from 'core-decorators';
import Item from './Item';

class ItemCheck extends Component {

  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    multi: PropTypes.bool,
    isSelected: PropTypes.bool,
  };

  static defaultProps = {
    label: undefined,
    value: undefined,
    isSelected: false,
    multi: false,
    onChange: () => {},
  };

  @autobind
  onPress() {
    this.props.onChange(this.props.value, this.props.label);
  }

  render() {
    const { label, isSelected, multi } = this.props;
    return (
      <Item onPress={this.onPress} label={label} isBold={multi && isSelected}>
        {isSelected && <Text style={s.check}>✓</Text>}
      </Item>
    );
  }
}

const s = StyleSheet.create({
  check: {
    fontSize: 17,
    color: '#fff',
  },
});


export default ItemCheck;
