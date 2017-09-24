import React, { Component } from 'react';
import { StyleSheet, SectionList, RefreshControl, View, Text } from 'react-native';
import { autobind } from 'core-decorators';
import { inject } from 'mobx-react/native';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import isToday from 'date-fns/is_today';
import isTomorrow from 'date-fns/is_tomorrow';
import format from 'date-fns/format';
import { Presets, MOVIE_SCREEN } from '../../screens';
import MovieItem from '../../components/movie-item';
import ComingSoonQL from './ComingSoonQL';

@inject('ui')
@ComingSoonQL
export default class ComingSoon extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  }

  @autobind
  onMovieItemPress(movie) {
    const { navigator } = this.props;
    const sharedElementId = `${movie.id}${movie.index}cs`;

    navigator.push({
      ...Presets.get(MOVIE_SCREEN),
      sharedElements: [sharedElementId],
      passProps: { movie, sharedElementId },
    });
  }

  @autobind
  renderMovieItem({ item, index }) {
    return (
      <View key={item.id}>
        <MovieItem
          onPress={this.onMovieItemPress}
          movie={{ ...item, index }}
          sharedElementId={`${item.id}${index}cs`}
        />
      </View>
    );
  }

  @autobind
  renderSectionHeader({ section }) {
    const date = section.title;
    let title = format(date, 'MMMM, D');
    if (isToday(date)) title = 'Today';
    if (isTomorrow(date)) title = 'Tomorrow';
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }

  render() {
    const { loading, fetchMore, refetch, movies = [] } = this.props.data;
    const moviesByDate = groupBy(movies, movie => (new Date(movie.releaseDate)).toDateString());
    return (
      <SectionList
        style={styles.host}
        sections={Object.entries(moviesByDate).map(([title, data]) => ({ title, data }))}
        keyExtractor={movie => movie.id}
        renderItem={this.renderMovieItem}
        renderSectionHeader={this.renderSectionHeader}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            style={styles.refresh}
            refreshing={loading}
            onRefresh={refetch}
          />
        }
        onEndReached={fetchMore}
      />
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
  },

  content: {
    padding: 20,
  },

  section: {
    marginBottom: 20,
  },

  title: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
