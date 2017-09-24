import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import ListItem from '../../components/list-item';

@observer
export default class FilterSortby extends Component {

  static navigatorStyle = {
    navBarNoBorder: true,
    navBarBackgroundColor: false,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    drawUnderTabBar: true,
  }

  options = ['Popular', 'Title', 'Rating', 'Year']

  @observable
  selected = 'Popular';

  render() {
    return (
      <ScrollView style={styles.host}>
        {this.options.map(option => (
          <ListItem
            key={option}
            title={option}
            icon={option === this.selected ? 'checkmark' : null}
            onPress={() => { this.selected = option; }}
          />
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 64,
  },
});
