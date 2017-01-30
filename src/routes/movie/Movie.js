/* global window */
import React, { Component, PropTypes } from 'react';
import { Alert, Button, Animated, View, Text, Image, StyleSheet, Linking } from 'react-native';
import { observer } from 'mobx-react/native';
import { computed, observable } from 'mobx';
import { autobind } from 'core-decorators';
import { Actions } from 'react-native-mobx';
import renderObserved from 'utils/render-observed';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import LinearGradient from 'react-native-linear-gradient'; // eslint-disable-line
import _get from 'lodash/get';
import _toArray from 'lodash/toArray';
import moment from 'moment';
import tmdb from 'utils/tmdb';
import BackButton from 'components/back-button';
import TrailerButton from 'routes/movie/components/TrailerButton';
import Synopsis from 'routes/movie/components/Synopsis';
import Badge from 'routes/movie/components/Badge';
import ShowtimesList from 'routes/movie/components/ShowtimesList';
import Lightbox from 'routes/movie/components/Lightbox';
import SharedElement from 'components/shared-element';
import store from 'store';

@observer
export default class Movie extends Component {

  static propTypes = {
    movie: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      backdropUrl: PropTypes.string,
      posterUrl: PropTypes.string,
    }),
    selectedDate: PropTypes.any, // eslint-disable-line
    showNotification: PropTypes.bool, // eslint-disable-line
  };

  static defaultProps = {
    movie: {
      title: '',
      genres: [],
    },
    selectedDate: null,
    showNotification: false,
  };

  @autobind
  onTrailerPress() {
    Linking.openURL(this.trailerUrl)
    .catch(err => console.error('Could not open url(%o): %o', this.trailerUrl, err)); // eslint-disable-line
  }

  @autobind
  onImdbPress() {
    Linking.openURL(this.imdbUrl)
    .catch(err => console.error('Could not open url(%o): %o', this.imdbUrl, err)); // eslint-disable-line
  }

  @autobind
  onNotificationPress() {
    const { id, title } = this.props.movie;
    const isNotification = store.user.isNotificationForMovie(id);
    if (!store.user.isAuthenticated) {
      Actions.SETTINGS_ACCOUNT();
    } else {
      Alert.alert(
        `"${title}"`,
        isNotification ? store.UI.i18n.REMOVE_NOTIFICATION : store.UI.i18n.SEND_NOTIFICATION_TEXT,
        [
          { text: store.UI.i18n.CANCEL, style: 'cancel' },
          { text: store.UI.i18n.OK, onPress: this.onNotificationConfirm },
        ],
      );
    }
  }

  @autobind
  onNotificationConfirm() {
    store.user.toggleNotificationForMovie(this.props.movie.id);
  }

  @autobind
  onScroll(e) {
    this.scrollY.setValue(e.nativeEvent.contentOffset.y);
  }

  @autobind
  onBackPress() {
    this.poster.reverse();
    return Actions.pop();
  }

  /**
   * @var {string} Backdrop size
   */
  @observable
  backdropSize = 'w780';

  /**
   * @var {Animated.Value} Scroll Y interpolated value
   */
  scrollY = new Animated.Value(0);

  @computed
  get backdropUrl() {
    return tmdb.getImageUrl(this.props.movie.backdropUrl, this.backdropSize);
  }

  @computed
  get posterUrl() {
    return tmdb.getImageUrl(this.props.movie.posterUrl);
  }

  @computed
  get days() {
    return [0, 1, 2, 3, 4].map(n => moment(store.UI.dateYmd).add(n, 'd'));
  }

  @computed
  get tabBarPage() {
    const { selectedDate } = this.props;
    const today = moment(store.UI.dateYmd);
    const wanted = moment(selectedDate || today);
    const page = wanted.diff(today, 'days') || 0;
    return page;
  }

  @computed
  get trailerUrl() {
    const { movie } = this.props;

    if (movie.youtubeTrailer && movie.youtubeTrailer !== '') {
      return `http://youtube.com/watch?v=${movie.youtubeTrailer}`;
    }

    if (movie.imdb && movie.imdb.trailer && movie.imdb.trailer !== '') {
      return `http://m.imdb.com${movie.imdb.trailer}`;
    }

    return null;
  }

  @computed
  get imdbUrl() {
    const id = _get(this.props.movie, 'imdb.id');

    if (id) {
      return `http://www.imdb.com/title/${id}`;
    }

    return null;
  }

  /**
   * Render backdrop image
   * @return {Component}
   */
  @autobind
  renderBackground() {
    return (
      <View style={s.background}>
        <Image
          resizeMode="cover"
          style={[{ width: window.width }, s.backgroundImage]}
          source={{ uri: this.backdropUrl }}
        />
      </View>
    );
  }

  /**
   * Render above the fold view.
   * @return {Component}
   */
  @autobind
  renderForeground() {
    const { movie } = this.props;
    const genres = _toArray(_get(movie, 'genres', {}));
    return (
      <View>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 0.5, 0.85, 1]}
          colors={['transparent', 'rgba(0, 0, 0, 0.6)', '#000', '#000']}
          style={s.gradient}
        />
        <View style={s.overlay}>
          <View style={s.overlayImage}>
            <SharedElement name="poster" x={30} ref={ref => (this.poster = ref)}>
              <Lightbox>
                <Image resizeMode="cover" source={{ uri: this.posterUrl }} style={s.image} />
              </Lightbox>
            </SharedElement>
          </View>
          <View style={s.overlayContent}>
            <Text style={s.title}>{movie.title}</Text>
            <Text
              style={[s.subtitle, s.genres]}
              numberOfLines={1}
              lineBreakMode="tail"
            >
              {genres.join(', ')}
            </Text>
            <Text style={[s.subtitle, s.runtime]}>{store.UI.i18n.RUNTIME(movie.duration)}</Text>
            <View style={s.rating}>
              <Badge type="imdb" rating={movie.imdb.rating} onPress={this.onImdbPress} />
              <Badge type="metascore" rating={movie.metaScore} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  /**
   * Render default shipped tabBar
   * @return {Component}
   */
  renderTabBar() {
    return (
      <DefaultTabBar
        underlineColor="#E80054"
        backgroundColor="#000"
        activeTextColor="#E80054"
        inactiveTextColor="#fff"
        underlineStyle={{ height: 2, backgroundColor: '#e80054' }}
        textStyle={s.tabBarText}
        style={s.tabBar}
      />
    );
  }

  /**
   * Render back button and trailer button with gradient on scroll.
   * @return {Component}
   */
  @autobind
  renderHeader() {

    const opacity = this.scrollY.interpolate({
      inputRange: [0, 64],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View>
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70, opacity }}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 0.5, 1]}
            colors={['#000', 'rgba(0, 0, 0, 0.5)', 'transparent']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70 }}
          />
        </Animated.View>
        {this.trailerUrl && <TrailerButton onPress={this.onTrailerPress} />}
        <BackButton onPress={this.onBackPress} />
      </View>
    );
  }

  /**
   * Main render
   */
  render() {
    const { movie } = this.props;
    const showtimes = store.movies.getMovieShowtimes(movie.id);
    const { showSynopsis } = store.UI;
    const isNotificationForMovie = store.user.isNotificationForMovie(movie.id);
    const { REMOVE_NOTIFICATION, SEND_NOTIFICATION } = store.UI.i18n;
    const showNotification = false;

    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <ParallaxScrollView
          onScroll={this.onScroll}
          showsVerticalScrollIndicator={false}
          backgroundColor="transparent"
          contentBackgroundColor="#000"
          parallaxHeaderHeight={360}
          renderBackground={() => renderObserved(this.renderBackground)}
          fadeOutForeground={false}
          renderForeground={() => renderObserved(this.renderForeground)}
          stickyHeaderHeight={70}
          renderFixedHeader={this.renderHeader}
        >
          {showSynopsis && (
            <View style={s.synopsis}>
              <Synopsis text={movie.storyline} />
            </View>
          )}
          {movie.showtimes && (
            <ScrollableTabView
              ref={c => c && c.goToPage(this.tabBarPage)}
              renderTabBar={this.renderTabBar}
              prerenderingSiblingsNumber={5}
            >
              {this.days.map((date, i) => (
                <ShowtimesList
                  key={date.format('d')}
                  date={date.toISOString().substr(0, 10)}
                  tabLabel={date.format('ddd')}
                  items={showtimes[i]}
                />
              ))}
            </ScrollableTabView>
          )}
          {showNotification && (
            <View style={s.notify}>
              <Button
                title={isNotificationForMovie ? REMOVE_NOTIFICATION : SEND_NOTIFICATION}
                color="#E80054"
                onPress={this.onNotificationPress}
              />
            </View>
          )}
        </ParallaxScrollView>
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: '#000',
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 225,
  },

  poster: {
    width: 100,
    height: 160,
  },

  overlay: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    height: 160,
    paddingHorizontal: 30,
    marginTop: 180,
    marginBottom: 30,
  },

  overlayImage: {
    width: 100,
    height: 160,
  },

  background: {
    height: 360,
    backgroundColor: '#222',
  },

  backgroundImage: {
    height: 360,
    opacity: 0.8,
  },

  image: {
    shadowColor: '#000',
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    width: 100,
    height: 160,
  },

  overlayContent: {
    marginLeft: 15,
    flex: 1,
  },

  title: {
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 24,
    color: '#fff',
    width: 175,
    marginBottom: 2,
  },

  subtitle: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
    marginTop: 0,
  },

  runtime: {},
  genres: {},

  rating: {
    flexDirection: 'row',
    marginTop: 5,
  },

  tabBar: {
    borderBottomWidth: 0,
  },

  tabBarText: {
    fontWeight: '300',
    fontSize: 18,
  },

  synopsis: {
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
    paddingBottom: 15,
  },

  notify: {
    paddingHorizontal: 30,
  },

});
