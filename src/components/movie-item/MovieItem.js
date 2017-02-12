import React, { Component, PropTypes } from 'react';
import { Image, View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { Actions } from 'react-native-mobx';
import { action, computed, observable, toJS } from 'mobx';
import { autobind } from 'core-decorators';
import Icon from 'react-native-vector-icons/Entypo';
import tmdb from 'utils/tmdb';
import _get from 'lodash/get';
import _toArray from 'lodash/toArray';
import store from 'store';
import SharedElement from 'components/shared-element';

export default class MovieListItem extends Component {

  static propTypes = {
    movie: PropTypes.shape({
      title: PropTypes.string,
      posterUrl: PropTypes.string,
      backdropUrl: PropTypes.string,
    }),
    selectedDate: PropTypes.object, // eslint-disable-line
    showNotification: PropTypes.bool,
  };

  static defaultProps = {
    movie: {},
    selectedDate: undefined,
    showNotification: false,
  };

  @autobind
  @action
  onPosterError() {
    this.posterUrlFailed = true;
  }

  @autobind
  onPress() {
    const { movie, selectedDate, showNotification } = this.props;
    if (this.poster && this.poster.prepare) {
      this.poster.prepare();
    }
    Actions.MOVIE({ id: movie.id, movie, selectedDate, showNotification });
  }

  @computed
  get posterUrl() {
    return tmdb.getImageUrl(this.props.movie.posterUrl);
  }

  @observable
  posterUrlFailed = !this.props.movie.posterUrl;

  render() {
    const movie = toJS(this.props.movie);
    const rating = _get(movie, 'imdb.rating', null);
    const metascore = _get(movie, 'metaScore', null);
    const genres = _toArray(_get(movie, 'genres'));
    const stars = _toArray(_get(movie, 'stars'));
    const directors = _toArray(_get(movie, 'directors'));

    return (
      <TouchableHighlight onPress={this.onPress}>
        <View style={s.host}>
          <View style={s.image}>
            {this.posterUrlFailed ? (
              <View style={s.icon}>
                <Icon name="video" size={48} color="#444" />
              </View>
            ) : (
              <Image
                source={{ uri: this.posterUrl }}
                style={s.poster}
                onError={this.onPosterError}
              />
            )}
          </View>
          <View style={s.details}>
            <Text style={s.title}>{_get(movie, 'title', null)}</Text>
            <Text
              style={s.subtitle}
              numberOfLines={1}
              lineBreakMode="tail"
            >{genres.join(', ')}</Text>
            <Text
              style={[s.subtitle, s.credit]}
              numberOfLines={3}
              lineBreakMode="tail"
            >
              <Text style={s.label}>{store.UI.i18n.ACTORS}: </Text>
              <Text>{stars.join(', ')}. </Text>
              <Text style={s.label}> {store.UI.i18n.DIRECTORS}: </Text>
              <Text>{directors.join(', ')}</Text>
            </Text>
            <View style={s.rating}>
              {rating && <View style={s.ratingItem}>
                <Text style={s.ratingValue}>{rating}</Text>
                <Text style={s.ratingType}>  IMDb</Text>
              </View>}
              {metascore && <View style={s.ratingItem}>
                <Text style={s.ratingValue}>{metascore}%</Text>
                <Text style={s.ratingType}>  Metascore</Text>
              </View>}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const s = StyleSheet.create({
  host: {
    padding: 15,
    flexDirection: 'row',
  },

  image: {
    marginRight: 15,
    backgroundColor: '#212121',
  },

  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 160,
    backgroundColor: '#444',
  },

  poster: {
    width: 100,
    height: 160,
  },

  title: {
    fontWeight: '300',
    fontSize: 22,
    lineHeight: 26,
    color: '#fff',
    marginBottom: 4,
  },

  details: {
    flex: 1,
  },

  subtitle: {
    color: '#fff',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 17,
  },

  credit: {
    fontSize: 13,
    color: '#aaa',
    marginVertical: 3,
  },

  label: {
    fontWeight: '300',
    color: '#fff',
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    width: 130,
  },

  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },

  ratingValue: {
    fontWeight: '300',
    fontSize: 20,
    color: '#fff',
  },

  ratingType: {
    fontWeight: '300',
    fontSize: 14,
    marginTop: 2,
    color: '#aaa',
  },
});
