/* eslint-disable */
import React from 'react';
import { View } from 'react-native';

const { PropTypes } = React;

const packages = ['FontAwesome', 'Entypo', 'EvilIcons', 'Foundation', 'Ionicons', 'Octicons', 'Zocial'];
const packageName = 'react-native-vector-icons';

const MockIcon = React.createClass({
  propTypes: {
    ...View.propTypes,
    size: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
  },
  measure(callback) {},
  measureLayout(relativeToNativeNode, onSuccess, onFail) {},
  setNativeProps(nativeProps) {},
  focus() {},
  blur() {},
  render() {
    return null;
  }
});

packages.forEach(name => {
  var key = require.resolve([packageName, name].join('/'));
  require.cache[key] = {
    id: key,
    filename: key,
    loaded: true,
    exports: MockIcon,
  };
});
