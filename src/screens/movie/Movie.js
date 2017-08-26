import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Animated, Image, View } from 'react-native';
import { autobind } from 'core-decorators';
import { computed } from 'mobx';
import { POSTER_SCREEN } from '../../screens';
import MovieItem from '../../components/movie-item';
import Toolbar from './components/toolbar';
import MovieDetails from './components/movie-details';
import openUrl from '../../utils/openUrl';

export const TOOLBAR_HEIGHT = Platform.select({ android: 58, ios: 64 });
export const POSTER_HEIGHT = 148;
export const BACKDROP_HEIGHT = 240;

export default class Movie extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    movie: PropTypes.object.isRequired,
    sharedElementId: PropTypes.string,
  }

  static defaultProps = {
    sharedElementId: undefined,
  }

  static navigatorButtons = {
    rightButtons: [{
      id: 'play-trailer',
      icon: require('../../images/icons/play-circle.png'),
    }],
  };

  @autobind
  onPosterPress() {
    this.props.navigator.push({
      screen: POSTER_SCREEN,
      sharedElements: [this.props.sharedElementId],
      passProps: {
        posterUrl: this.props.movie.posterUrl,
        sharedElementId: this.props.sharedElementId,
      },
    });
  }

  @autobind
  onTrailerPress() {
    let url = this.props.movie.trailerUrl;
    if (!url) {
      const query = [this.props.movie.title, 'trailer'].join(' ');
      url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    }
    openUrl(url);
  }

  @autobind
  onBackPress() {
    this.props.navigator.pop();
  }

  @autobind
  onImdbPress() {
    const { imdbId } = this.props.movie;
    openUrl(`http://www.imdb.com/title/${imdbId}`);
  }

  @computed
  get backdropUrl() {
    return `https://image.tmdb.org/t/p/w780/${this.props.movie.backdropUrl}`;
  }

  scrollY = new Animated.Value(0);

  render() {
    const { scrollY, backdropUrl, props } = this;
    const { movie } = props;
    const animatedHero = {
      transform: [{
        translateY: scrollY.interpolate({
          inputRange: [-300, 0, BACKDROP_HEIGHT],
          outputRange: [-150, 0, TOOLBAR_HEIGHT],
        }),
      }, {
        scale: scrollY.interpolate({
          extrapolate: 'clamp',
          inputRange: [-300, 0],
          outputRange: [2.5, 1],
        }),
      }],
    };

    return (
      <View style={styles.host}>
        <Animated.ScrollView
          style={styles.host}
          scrollEventThrottle={1}
          contentInset={{ bottom: 30 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            { useNativeDriver: true },
          )}
        >
          <View style={styles.movieItem}>
            <MovieItem
              movie={movie}
              sharedElementId={this.props.sharedElementId}
              onPosterPress={this.onPosterPress}
              onImdbPress={movie.imdbId && this.onImdbPress}
              styles={{}}
            />
          </View>
          <Animated.View style={[styles.hero, animatedHero]}>
            <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
            <Image
              source={require('../../images/backdrop-overlay.png')}
              style={styles.backdropOverlay}
            />
          </Animated.View>
          <MovieDetails movie={movie} />
        </Animated.ScrollView>
        <View style={styles.toolbar}>
          <Toolbar
            scrollY={this.scrollY}
            movie={movie}
            onBackPress={this.onBackPress}
            onTrailerPress={this.onTrailerPress}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
  },

  toolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOOLBAR_HEIGHT,
    zIndex: 110,
  },

  hero: {
    position: 'relative',
    marginBottom: 15,
  },

  movieItem: {
    position: 'absolute',
    top: (BACKDROP_HEIGHT - POSTER_HEIGHT) + 30,
    left: 30,
    zIndex: 10,
  },

  backdrop: {
    height: BACKDROP_HEIGHT,
  },

  backdropOverlay: {
    position: 'absolute',
    height: BACKDROP_HEIGHT,
    width: '100%',
    bottom: 0,
    // backgroundColor: 'blue',
  },
});
