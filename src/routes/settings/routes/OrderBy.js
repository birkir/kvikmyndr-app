import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react/native';
import List, { Group, ItemCheck } from 'components/list';
import store from 'store';

@observer
export default class SettingsOrderBy extends Component {

  onChange(val) {
    store.UI.filter.orderBy = val;
  }

  render() {
    const { filter, orderBy } = store.UI;
    return (
      <View style={s.host}>
        <List>
          <Group label={store.UI.i18n.ORDER_MOVIES_BY}>
            {Object.entries(orderBy).map(([key, label]) => (
              <ItemCheck
                key={key}
                label={store.UI.i18n[label]}
                value={key}
                isSelected={filter.orderBy === key}
                onChange={this.onChange}
              />
            ))}
          </Group>
        </List>
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: 64,
  },
});
