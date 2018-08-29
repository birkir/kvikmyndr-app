import * as React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import { IMovie } from 'store/models/Movie';
import { autobind } from 'core-decorators';
import { Navigation } from 'react-native-navigation';
import ImdbRating from '../imdb-rating/ImdbRating';
// import Metascore from '../metascore/Metascore';
const styles = require('./MovieItem.css');

interface IProps {
  movie: IMovie;
  elementId: string;
  onPress?(props: IProps, event: GestureResponderEvent): void;
  selectedTab?: number;
  testID?: string;
}

export default class MovieItem extends React.PureComponent<IProps, {}> {

  @autobind
  onPress(e: GestureResponderEvent) {
    if (this.props.onPress) {
      this.props.onPress(this.props, e);
    }
  }

  get genres() {
    if (!this.props.movie.genres) {
      return null;
    }

    return (
      <Text style={styles.genres} numberOfLines={1}>
        {this.props.movie.genres.map(item => item.name).join(', ')}
      </Text>
    );
  }

  onImdbPress() {
    return;
  }

  onMetacriticPress() {
    return;
  }

  render() {
    const {
      movie,
      onPress,
      elementId,
      testID,
    } = this.props;

    const isRating = movie && (movie.imdbRating || movie.metacriticRating);

    return (
      <TouchableWithoutFeedback onPress={this.onPress} disabled={!onPress} testID={testID}>
        <View style={styles.host}>
          <Navigation.Element elementId={elementId} resizeMode="cover">
            <View style={styles.poster}>
              {movie.posterUrl && <Image
                resizeMode="cover"
                style={styles.poster__image}
                source={{ uri: movie.posterUrlNormal! }}
              />}
            </View>
          </Navigation.Element>
          <View style={styles.content}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.genres} numberOfLines={1}>
              {this.genres}
            </Text>
            <Text style={styles.runtime}>{movie.formatRuntime}</Text>
            {isRating && (
              <View style={styles.ratings}>
                <ImdbRating
                  imdbId={movie.imdbId!}
                  rating={movie.imdbRating!}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
