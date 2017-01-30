import React, { Component } from 'react';
import { View, Text, StyleSheet, ListView } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import moment from 'moment';
import MovieItem from 'components/movie-item';
import store from 'store';

const ds = new ListView.DataSource({
  rowHasChanged: (a, b) => (a !== b),
  sectionHeaderHasChanged: (a, b) => (a !== b),
});

@observer
export default class ComingSoon extends Component {

  componentDidMount() {
    this.unsubscribe = store.movies.subscribeComingSoon();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  @computed
  get rows() {
    const rows = [];
    const { comingSoon } = store.movies;
    comingSoon
    .map(({ items, date }) => ({ items, date: moment(date) }))
    .sort((a, b) => a.date.diff(b.date))
    .filter(({ date }) => date.isAfter(store.UI.date))
    .forEach(({ items, date }) => {
      Object.keys(items).forEach((key) => {
        items[key].date = date; // eslint-disable-line
      });
      rows.push(items);
    });
    return rows;
  }

  /**
   * Section header render method
   * @param {array} Array of section items
   * @param {number} Number of section.
   * @return {Component}
   */
  renderSectionHeader(items) {
    // Get key of first item
    const firstItem = Object.values(items).shift();

    // Find it's date
    const date = moment(firstItem.date);

    // Render section header
    return (
      <View style={s.section}>
        <Text style={s.sectionText}>{date.format('dddd D. MMMM YYYY')}</Text>
      </View>
    );
  }

  /**
   * Row render method
   * @param {object} Row item object
   * @return {Component}
   */
  renderRow(movie) {
    return (
      <MovieItem movie={movie} showNotification />
    );
  }

  render() {
    return (
      <ListView
        dataSource={ds.cloneWithRowsAndSections(this.rows)}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
        style={s.host}
      />
    );
  }
}

const s = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: 64,
  },

  section: {
    alignItems: 'center',
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ff2244',
  },

  sectionText: {
    fontWeight: '300',
    fontSize: 20,
    color: '#ff2244',
    padding: 8,
  },
});
