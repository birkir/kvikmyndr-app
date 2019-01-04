import * as React from 'react';
import { Animated, View, Text, StyleSheet,
  BackHandler, Platform, TouchableWithoutFeedback, Linking } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import { groupBy } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import PhotoView from '@merryjs/photo-viewer';
import { Options } from 'types/Options';
import WeekTabView from 'components/week-tab-view/WeekTabView';
import Showtime from 'components/showtime/Showtime';
import ImdbRating from 'components/imdb-rating/ImdbRating';
import Metascore from 'components/metascore/Metascore';
import { openUrl } from 'utils/openUrl';
import { Movies } from 'store/movies';
import { IMovie } from 'store/models/Movie';
import { IShowtime } from 'store/models/Showtime';
import { Store } from 'store';
import MovieDetails from './MovieDetails';

const styles = require('./Movie.css');

interface IProps {
  componentId: string;
  movieId: string;
  selectedTab?: number;
  children?: React.ReactNode;
}

const GUTTER = 8 * 2;
const TOOLBAR_HEIGHT = 56;
const BACKDROP_HEIGHT = 240;
const POSTER_WIDTH = 100;
const POSTER_HEIGHT = 160;
const POSTER_X = (BACKDROP_HEIGHT - POSTER_HEIGHT) + 32;

@observer
export default class Movie extends React.Component<IProps> {

  static get options() {
    return {
      topBar: {
        title: {
          color: '#FFFFFF',
        },
        elevation: 0,
        backButton: {
          color: '#FFFFFF',
          transition: 'custom',
        } as any,
        translucent: true,
        transparent: true,
        drawBehind: true,
        background: Platform.select({
          android: {
            color: 'rgba(0, 0, 0, 0)',
          },
        }),
        // Fix for 1px black border on navbar :/
        height: POSTER_X + POSTER_HEIGHT,
        noBorder: true,
        leftButtons: [{
          id: 'ICON_BACK',
          icon: require('../../assets/icons/back.png'),
          color: '#FFFFFF',
        }],
        rightButtons: [{
          id: 'ICON_TRAILER',
          icon: require('../../assets/icons/play-circle.png'),
          color: '#FFFFFF',
        }],
      },
      layout: {
        backgroundColor: '#000000',
      },
      popGesture: true,
      animations: Store.settings.posterAnimation ? {
        pop: {
          content: {
            alpha: {
              from: 1,
              to: 0,
              duration: 250,
            },
          },
        },
      } : {},
      bottomTabs: {
        translucent: false,
        barStyle: 'black',
        drawBehind: true,
        backgroundColor: '#000000',
      },
    } as Options;
  }

  private events = Navigation.events().bindComponent(this);
  private scrollY = new Animated.Value(0);

  private animatedHeroStyles = {
    transform: [{
      translateY: this.scrollY.interpolate({
        inputRange: [-(BACKDROP_HEIGHT + TOOLBAR_HEIGHT), 0, BACKDROP_HEIGHT],
        outputRange: [-(BACKDROP_HEIGHT + TOOLBAR_HEIGHT) / 2, 0, TOOLBAR_HEIGHT],
      }),
    }, {
      scale: this.scrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [-(BACKDROP_HEIGHT + TOOLBAR_HEIGHT), 0],
        outputRange: [2.5, 1],
      }),
    }],
  };

  private animatedTopBarStyles = {
    opacity: this.scrollY.interpolate({
      inputRange: [0, TOOLBAR_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
  };

  state = {
    visible: false,
    initial: 0,
  };

  componentDidMount() {
    Movies.loadMovieById(this.props.movieId);
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
    this.events.remove();
  }

  componentDidAppear() {
    Store.setComponentId(this.props.componentId);
  }

  @autobind
  async navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'ICON_BACK') {
      return Navigation.pop(this.props.componentId);
    }

    if (buttonId === 'ICON_TRAILER') {
      const { title, trailerUrl } = Movies.getOrLoadById(this.props.movieId)!;

      if (!trailerUrl) {
        const query = [title, 'trailer'].join(' ');
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const youtubeAppUrl = youtubeUrl.replace(/^https/, 'youtube');
        if (await Linking.canOpenURL(youtubeAppUrl)) {
          return Linking.openURL(youtubeAppUrl);
        }

        return openUrl(youtubeUrl);
      }

      return openUrl(trailerUrl);
    }
  }

  @autobind
  onHardwareBackPress() {
    Navigation.pop(this.props.componentId);
    return true;
  }

  @autobind
  onPosterPress() {
    this.setState({
      visible: true,
    });
  }

  sortByTime = (a: IShowtime, b: IShowtime) => {
    return new Date(a.playingAt || '') < new Date(b.playingAt || '') ? -1 : 1;
  }

  @autobind
  renderTab(route: any) {
    const movie = Movies.getOrLoadById(this.props.movieId);

    if (!movie) {
      return null;
    }

    const cinemas = groupBy(
      movie.showtimesForDate(route.date),
      (showtime: any) => showtime.cinema && showtime.cinema.name,
    );

    return (
      <View style={styles.showtimes}>
        {Object.entries(cinemas).map(([cinema, showtimes]: any) => (
          <View key={cinema}>
            <Text style={styles.cinema}>{cinema}</Text>
            <View style={styles.row}>
              {showtimes.sort(this.sortByTime).map((showtime: IShowtime) => (
                <Showtime key={showtime.id} showtime={showtime} />
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }

  render() {
    const movie = Movies.getOrLoadById(this.props.movieId);
    const showtimes = (movie!.showtimes! || []);
    const isReady = !movie!.isPartial && showtimes.length > 0 && !!showtimes[0].cinema;

    return (
      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          style={styles.host}
          testID="MOVIE_SCREEN"
          contentInsetAdjustmentBehavior="never"
          scrollEventThrottle={1}
          overScrollMode="always"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            { useNativeDriver: true },
          )}
        >
          <Animated.View style={[styles.hero, this.animatedHeroStyles]}>
            <FastImage
              resizeMode="cover"
              source={{ uri: movie && movie.backdropImageUrl }}
              style={styles.backdrop}
            />
            <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          <PhotoView
            visible={this.state.visible}
            data={[{
              source: {
                uri: movie!.posterUrlOriginal,
              },
            }]}
            hideCloseButton={true}
            hideShareButton={true}
            hideStatusBar={false}
            initial={this.state.initial}
            onDismiss={() => this.setState({ visible: false })}
          />

          {movie && (
            <View style={[styles.content, { top: POSTER_X, left: POSTER_WIDTH + GUTTER }]}>
              <Text style={styles.title}>{movie.locale.title}</Text>
              {movie.genres && (
                <Text style={styles.genres} numberOfLines={2}>
                  {movie.genres.map((item: any) => item.name).join(', ')}
                </Text>
              )}
              {movie.runtime && (
                <Text style={styles.runtime}>{movie.formatRuntime}</Text>
              )}
              <View style={styles.ratings}>
                <ImdbRating
                  imdbId={movie.imdbId!}
                  rating={movie.imdbRating!}
                />
                <Metascore
                  rating={movie.metacriticRating!}
                />
              </View>
            </View>
          )}

          <MovieDetails
            movie={movie as IMovie}
          />

          <View style={{ position: 'absolute', top: POSTER_X, left: GUTTER }}>
            <Navigation.Element
              resizeMode="cover"
              elementId="MOVIE_POSTER"
            >
              <TouchableWithoutFeedback onPress={this.onPosterPress}>
                <View style={styles.poster}>
                  {movie!.posterUrl && <FastImage
                    resizeMode="cover"
                    style={styles.poster__image}
                    source={{ uri: movie!.posterUrlNormal }}
                  />}
                </View>
              </TouchableWithoutFeedback>
            </Navigation.Element>
          </View>

          {isReady && (
            <WeekTabView
              render={this.renderTab}
              useScrollView={false}
              selectedTab={this.props.selectedTab}
            />
          )}

          <View style={{ height: 100 }} />
        </Animated.ScrollView>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            ...this.animatedTopBarStyles,
          }}
        >
          <View
            style={{
              height: Store.insets.top - TOOLBAR_HEIGHT,
              width: '100%',
              backgroundColor: 'black',
            }}
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
            style={{ height: TOOLBAR_HEIGHT * 2, width: '100%' }}
          />
        </Animated.View>
      </View>
    );
  }
}
