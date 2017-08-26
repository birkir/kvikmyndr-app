import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Group, Item } from '../../components/settings';
import UI from '../../store/UI';

@inject('ui')
@observer
export default class Account extends Component {

  render() {

    const items = [{
      label: 'Grid',
      value: UI.Layout.GRID,
    }, {
      label: 'List',
      value: UI.Layout.LIST,
    }];

    const selected = this.props.ui.settings.movieCardLayout;

    return (
      <View style={styles.host}>
        <Group legend="Settings">
          {items.map(({ label, value }) => (
            <Item
              label={label}
              isSelected={selected === value}
              onPress={() => { this.props.ui.settings.movieCardLayout = value; }}
            />
          ))}
        </Group>
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
});
