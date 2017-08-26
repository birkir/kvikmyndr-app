import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

export default class Poster extends Component {

  static propTypes = {
    imageUrl: PropTypes.string,
  }

  static defaultProps = {
    imageUrl: undefined,
  }

  render() {
    const { imageUrl } = this.props;
    const posterUrl = imageUrl && imageUrl[0] === '/' ? `https://image.tmdb.org/t/p/w342/${imageUrl}` : imageUrl;
    return (
      <Image style={styles.image} source={{ uri: posterUrl }} />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
});
