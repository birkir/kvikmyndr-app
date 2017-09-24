import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import InTheatersScreen from './InTheatersScreen';

@inject('ui')
@observer
export default class InTheaters extends Component {
  static propTypes = {
    ui: PropTypes.object.isRequired,
  }

  render() {
    const { daysFromNow } = this.props.ui.inTheatersHeader;
    return (
      <View style={styles.host}>
        <InTheatersScreen daysFromNow={daysFromNow} {...this.props} />
        <View style={styles.backdrop} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 64,
    backgroundColor: 'rgba(12, 12, 12, 0.66)',
  },
});
