import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import { autobind } from 'core-decorators';
import { FILTER_SORTBY_SCREEN } from '../../screens';
import ListItem from '../../components/list-item';

export default class Filter extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  static navigatorStyle = {
    navBarNoBorder: true,
    navBarBackgroundColor: false,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    drawUnderTabBar: true,
  }

  static navigatorButtons = {
    rightButtons: [{
      title: 'Done',
      id: 'done',
    }],
  }

  componentWillMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  @autobind
  onNavigatorEvent(e) {
    if (e.type === 'NavBarButtonPress' && e.id === 'done') {
      this.props.navigator.pop();
    }
  }

  @autobind
  onSortByPress() {
    this.props.navigator.push({
      screen: FILTER_SORTBY_SCREEN,
      title: 'Sort by',
    });
  }

  render() {
    return (
      <ScrollView style={styles.host}>
        <ListItem
          title="Sort by"
          value="Popular"
          onPress={this.onSortByPress}
        />
        <ListItem
          title="Cinemas"
          value="All"
        />
        <ListItem
          title="Rating"
          value="6.0 - 7.1"
        />
        <ListItem
          title="Showtimes"
          value="20:00 - 22:00"
        />
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
