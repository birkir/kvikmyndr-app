import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, StyleSheet, FlatList, View } from 'react-native';
import { autobind } from 'core-decorators';
import { observer, inject } from 'mobx-react/native';
import UI from '../../store/UI';
import { Presets, MOVIE_SCREEN, FILTER_SCREEN } from '../../screens';
import MovieItem from '../../components/movie-item';
import withInTheaters from '../../store/queries/withInTheaters';

@inject('ui')
@withInTheaters
@observer
export default class InTheaters extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    daysFromNow: PropTypes.number,
    data: PropTypes.object.isRequired,
  }

  static defaultProps = {
    daysFromNow: 0,
  }

  componentWillMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  @autobind
  onFilterApply() {
    this.props.data.refetch();
  }

  @autobind
  onNavigatorEvent(e) {
    if (e.type === 'NavBarButtonPress' && e.id === 'filter') {
      this.props.navigator.showModal({
        screen: FILTER_SCREEN,
        passProps: {
          onApply: this.onFilterApply,
        },
        navigatorStyle: {
          navBarBackgroundColor: 'transparent',
          navBarHidden: true,
        },
        animated: false,
      });
    }
  }

  @autobind
  onMovieItemPress(movie) {
    const { navigator, daysFromNow } = this.props;
    const sharedElementId = `${movie.id}${movie.index}${daysFromNow}`;

    navigator.push({
      ...Presets.get(MOVIE_SCREEN),
      sharedElements: [sharedElementId],
      passProps: { movie, sharedElementId },
    });
  }

  @autobind
  renderMovieItem({ item, index }) {
    const { daysFromNow, ui } = this.props;
    return (
      <View key={item.id}>
        <MovieItem
          movie={{ ...item, index }}
          layout={ui.settings.movieCardLayout}
          onPress={this.onMovieItemPress}
          sharedElementId={`${item.id}${index}${daysFromNow}`}
        />
      </View>
    );
  }

  render() {
    const { data, ui } = this.props;
    const { movies = [], refetch, loading, fetchMore } = data;
    const isGridLayout = (ui.settings.movieCardLayout === UI.Layout.GRID);

    return (
      <FlatList
        key={ui.settings.movieCardLayout}
        style={styles.host}
        data={movies}
        keyExtractor={movie => movie.id}
        renderItem={this.renderMovieItem}
        contentContainerStyle={styles.content}
        numColumns={isGridLayout ? 3 : 1}
        columnWrapperStyle={isGridLayout && styles.columns}
        refreshControl={
          <RefreshControl
            style={styles.refresh}
            refreshing={loading}
            onRefresh={refetch}
          />
        }
        onEndReached={fetchMore}
        contentInset={{ top: 64, bottom: 68 }}
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
  columns: {
    justifyContent: 'space-between',
  },
});
