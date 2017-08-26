import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { Platform, StyleSheet, View, Image } from 'react-native';
import { SharedElementTransition } from 'react-native-navigation';

@observer
export default class Poster extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    posterUrl: PropTypes.string,
    sharedElementId: PropTypes.string,
  }

  static defaultProps = {
    posterUrl: undefined,
    sharedElementId: undefined,
  }

  static navigatorStyle = {
    navBarButtonColor: '#FFFFFF',
    navBarBackgroundColor: '#000000',
    navBarTextColor: '#FFFFFF',
    navBarTransparent: true,
    navBarHidden: Platform.OS === 'ios',
    tabBarHidden: true,
  }

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

    Image.prefetch(this.getPosterUrl('original'))
      .then(() => {
        this.isOriginalLoaded = true;
      });
  }

  @autobind
  onNavigatorEvent(e) {
    if (e.id === 'willDisappear') {
      this.isOriginalLoaded = false;
    }
  }

  @autobind
  getPosterUrl(size) {
    const { posterUrl } = this.props;
    if (String(posterUrl).substr(0, 1) === '/') {
      return `https://image.tmdb.org/t/p/${size}/${posterUrl}`;
    }
    return posterUrl;
  }

  @observable
  isOriginalLoaded = false;

  render() {
    const { sharedElementId } = this.props;
    return (
      <View style={styles.host}>
        <SharedElementTransition
          sharedElementId={sharedElementId}
          showDuration={400}
          hideDuration={300}
          animateClipBounds
          showInterpolation={{ type: 'linear', easing: 'FastOutSlowIn' }}
          hideInterpolation={{ type: 'linear', easing: 'FastOutSlowIn' }}
        >
          <Image source={{ uri: this.getPosterUrl('w342') }} style={styles.fullSize} />
        </SharedElementTransition>
        {this.isOriginalLoaded && (
          <View style={StyleSheet.absoluteFill}>
            <Image source={{ uri: this.getPosterUrl('original') }} style={styles.fullSize} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    position: 'relative',
    flex: 1,
  },
  fullSize: {
    width: '100%',
    height: '100%',
  },
});
