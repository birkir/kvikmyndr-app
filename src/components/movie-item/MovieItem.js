import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, Dimensions, StyleSheet, TouchableWithoutFeedback, View, Text, Animated } from 'react-native';
import { SharedElementTransition } from 'react-native-navigation';
import { autobind } from 'core-decorators';
import UI from '../../store/UI';
import Poster from '../poster';
import IMDBRating from '../imdb-rating';
import Metascore from '../metascore';

export default class MovieItem extends Component {

  static propTypes = {
    movie: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
    layout: PropTypes.any,
    onPress: PropTypes.func,
    onPosterPress: PropTypes.func,
    onImdbPress: PropTypes.func,
    onMetacriticPress: PropTypes.func,
    sharedElementId: PropTypes.string,
    styles: PropTypes.object,
  }

  static defaultProps = {
    movie: {},
    layout: UI.Layout.LIST,
    onPress: undefined,
    onPosterPress: undefined,
    onImdbPress: undefined,
    onMetacriticPress: undefined,
    sharedElementId: undefined,
    styles: {},
  }

  @autobind
  onPress(e) {
    this.props.onPress(this.props.movie, e);
  }

  @autobind
  onPosterPress(e) {
    this.props.onPosterPress(this.props.movie, e);
  }

  render() {
    const {
      movie,
      layout,
      sharedElementId,
      onPress,
      onPosterPress,
      onImdbPress,
      onMetacriticPress,
      styles: passedStyles,
    } = this.props;

    const width = Dimensions.get('window').width - 100 - 60;
    const isGridLayout = (layout === UI.Layout.GRID);
    const isListLayout = (layout === UI.Layout.LIST);

    return (
      <TouchableWithoutFeedback onPress={this.onPress} disabled={!onPress}>
        <View style={[styles.host, isGridLayout ? styles.hostGrid : styles.hostList]}>
          <View style={[styles.poster, isGridLayout ? styles.posterGrid : styles.posterList]}>
            {onPosterPress && (
              <TouchableWithoutFeedback onPress={this.onPosterPress} style={styles.posterMock}>
                <View style={styles.posterMock} />
              </TouchableWithoutFeedback>
            )}
            <SharedElementTransition
              sharedElementId={sharedElementId}
              showDuration={400}
              hideDuration={300}
              animateClipBounds
              showInterpolation={{ type: 'linear', easing: 'FastOutSlowIn' }}
              hideInterpolation={{ type: 'linear', easing: 'FastOutSlowIn' }}
            >
              <Poster
                imageUrl={movie.posterUrl}
              />
            </SharedElementTransition>
          </View>
          {isGridLayout && (
            <Text numberOfLines={2} style={styles.titleGrid}>{movie.title}</Text>
          )}
          {isListLayout && (
            <View style={[styles.content, { width }]}>
              <Animated.Text style={[styles.title, passedStyles.title]}>
                {movie.title}
              </Animated.Text>
              {!!movie.genres.length && (
                <Text style={styles.genres} numberOfLines={1}>
                  {(movie.genres || []).map(item => item.name).join(', ')}
                </Text>
              )}
              {!!movie.runtime && movie.runtime > 0 && (
                <Text style={styles.runtime}>{movie.runtime} min</Text>
              )}
              {!!movie.imdbRating && !!movie.metacriticRating && (
                <View style={styles.ratings}>
                  {!!movie.imdbRating && (
                    <IMDBRating
                      onPress={onImdbPress}
                      rating={movie.imdbRating}
                    />
                  )}
                  {!!movie.imdbRating && <View style={styles.ratingSpacer} />}
                  {!!movie.metacriticRating && (
                    <Metascore
                      onPress={onMetacriticPress}
                      rating={movie.metacriticRating}
                    />
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const { width, height } = Dimensions.get('window');
const posterWidth = Math.floor((width - 40) / 3) - 10;

const styles = StyleSheet.create({

  host: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  hostList: {
    width: '100%',
  },

  hostGrid: {
    flexDirection: 'column',
    width: posterWidth,
  },

  poster: {
    width: posterWidth,
    aspectRatio: 100 / 148,
    borderRadius: 3,

    // iOS shadow
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 5 },
    shadowColor: '#000000',
    shadowRadius: 11,
  },

  posterGrid: {
    marginRight: 20,
    maxHeight: height - 160,
  },

  posterList: {
    width: 100,
  },

  posterMock: {
    position: 'absolute',
    width: 100,
    aspectRatio: 100 / 148,
    zIndex: 150,
  },

  content: {
    overflow: 'scroll',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    marginLeft: 20,
  },

  title: {
    fontWeight: Platform.select({ android: '100', ios: '300' }),
    fontSize: 22,
    color: '#FFFFFF',
    zIndex: 100,
    marginBottom: 2,
  },

  titleGrid: {
    marginTop: 5,
    fontWeight: Platform.select({ android: '100', ios: '300' }),
    fontSize: 13,
    color: '#FFFFFF',
    width: 100,
  },

  genres: {
    fontWeight: '100',
    fontSize: 16,
    color: '#B5B5B5',
    paddingBottom: 4,
  },

  runtime: {
    fontWeight: '100',
    fontSize: 16,
    color: '#B5B5B5',
    paddingBottom: 4,
  },

  ratings: {
    flexDirection: 'row',
  },

  ratingSpacer: {
    width: 20,
  },
});
