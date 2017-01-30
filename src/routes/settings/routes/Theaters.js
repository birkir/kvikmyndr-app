import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react/native';
import List, { Group, ItemCheck } from 'components/list';
import store from 'store';

@observer
export default class SettingsTheaters extends Component {

  onChange(val) {
    const has = store.UI.filter.theaters.indexOf(val);
    if (val === 'all') {
      store.UI.filter.theaters.clear();
    } else if (has === -1) {
      store.UI.filter.theaters.push(val);
    } else {
      store.UI.filter.theaters.splice(has, 1);
    }
  }

  sortByTitle(a, b) {
    return a.localeCompare(b);
  }

  render() {
    const { filter, theaters } = store.UI;
    return (
      <View style={s.host}>
        <List>
          <Group label={store.UI.i18n.SELECT_THEATERS}>
            <ItemCheck
              multi
              key="all"
              label={store.UI.i18n.ALL_THEATERS}
              value="all"
              isSelected={filter.theaters.length === 0}
              onChange={this.onChange}
            />
            {theaters.sort(this.sortByTitle).map(item => (
              <ItemCheck
                multi
                key={item}
                label={item}
                value={item}
                isSelected={filter.theaters.indexOf(item) >= 0}
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
