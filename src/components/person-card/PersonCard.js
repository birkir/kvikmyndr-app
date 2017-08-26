import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { autobind } from 'core-decorators';
import openUrl from '../../utils/openUrl';

@observer
export default class PersonCard extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    pictureUrl: PropTypes.string,
  }

  static defaultProps = {
    name: undefined,
    pictureUrl: undefined,
  }

  @autobind
  onLoadStart() {
    this.isLoading = true;
  }

  @autobind
  onLoadEnd() {
    this.isLoading = false;
  }

  @autobind
  onError() {
    this.isLoading = false;
  }

  @autobind
  onPress() {
    const name = encodeURIComponent(this.props.name);
    const url = `https://www.google.com/search?q=${name}#mie=e,overview,${name}`;
    openUrl(url);
  }

  get pictureUrl() {
    if (!this.props.pictureUrl) return null;
    return `https://image.tmdb.org/t/p/w500${this.props.pictureUrl}`;
  }

  @observable
  isLoading = false;

  render() {
    const { name } = this.props;
    return (
      <View style={styles.host}>
        <TouchableOpacity onPress={this.onPress} style={styles.shadow}>
          <ActivityIndicator style={styles.loading} animating={this.isLoading} />
          {!this.pictureUrl
            ? <View style={styles.picture} />
            : <Image
              onLoadStart={this.onLoadStart}
              onLoadEnd={this.onLoadEnd}
              onError={this.onError}
              style={styles.picture}
              source={{ uri: this.pictureUrl }}
            />
          }
        </TouchableOpacity>
        <Text style={styles.name}>{name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    marginRight: 20,
  },

  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },

  shadow: {
    position: 'relative',
    width: 70,
    height: 100,
    borderRadius: 3,
    marginBottom: 5,
    backgroundColor: '#353535',

    // iOS shadow
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 5 },
    shadowColor: '#000000',
    shadowRadius: 11,
  },

  picture: {
    width: 70,
    height: 100,
    borderRadius: 3,
  },

  name: {
    opacity: 0.7,
    fontSize: 10,
    color: '#FFFFFF',
    width: 70,
  },
});
