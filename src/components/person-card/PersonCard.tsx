import * as React from 'react';
import { View, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { autobind } from 'core-decorators';
import { openUrl } from 'utils/openUrl';

const styles = require('./PersonCard.css');

interface IProps {
  name?: string | null;
  pictureUrl?: string | null;
}

@observer
export default class PersonCard extends React.Component<IProps, {}> {

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
    if (!this.props.name) {
      return null;
    }

    const name = encodeURIComponent(this.props.name);
    const url = `https://www.google.com/search?q=${name}`;
    return openUrl(url);
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
            ? <View style={styles.picture}>
                <Image
                  source={require('assets/icons/cast-placeholder.png')}
                  style={styles.picture__placeholder}
                />
              </View>
            : <Image
              onLoadStart={this.onLoadStart}
              onLoadEnd={this.onLoadEnd}
              onError={this.onError}
              style={styles.picture}
              source={{ uri: this.pictureUrl }}
            />
          }
        </TouchableOpacity>
        {!!name && <Text style={styles.name}>{name}</Text>}
      </View>
    );
  }
}
