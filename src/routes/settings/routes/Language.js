import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react/native';
import List, { Group, ItemCheck } from 'components/list';
import store from 'store';

@observer
export default class SettingsLanguage extends Component {

  onChange(val) {
    store.UI.language = val;
  }

  render() {
    const { language, languages } = store.UI;
    return (
      <View style={s.host}>
        <List>
          <Group label={store.UI.i18n.SELECT_LANGUAGE}>
            {Object.entries(languages).map(([key, label]) => (
              <ItemCheck
                key={key}
                label={label}
                value={key}
                isSelected={language === key}
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
