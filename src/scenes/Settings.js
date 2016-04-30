import React, {
  Component,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableHighlight,
  Switch,
} from 'react-native';

import SettingsStore from '../stores/SettingsStore';

export default class SceneSettings extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      showSynoptis: true,
    };
  }

  /**
   * Render method
   * @return {Component}
   */
  render () {
    const { items } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}>
            <Text style={{flex:1}}>Sýna söguþráð</Text>
            <Switch
              onValueChange={flag => this.setState({ showSynoptis: flag })}
              value={this.state.showSynoptis}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
