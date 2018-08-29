import * as React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import { Navigation } from 'react-native-navigation';
import { Options } from 'types/Options';
import Button from 'components/button/Button';
const styles = require('./Poster.css');

interface IProps {
  componentId: string;
  imageUrl: string;
}

@observer
export default class Poster extends React.Component<IProps> {

  get options() {
    return {
      topBar: {
        visible: false,
      },
      layout: {
        backgroundColor: 'transparent',
      },
      bottomTabs: {
        visible: false,
      },
    } as Options;
  }

  onPress = () => {
    Navigation.dismissOverlay(this.props.componentId);
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <TouchableOpacity onPress={this.onPress}>
          <Navigation.Element elementId="IMAGE_POSTER" resizeMode="contain" style={{ width: '100%', height: '100%' }}>
            <Image resizeMode="contain" style={{ width: '100%', height: '100%' }} source={{ uri: this.props.imageUrl }} />
          </Navigation.Element>
        </TouchableOpacity>
      </View>
    );
  }
}
