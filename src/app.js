import React, { Component, View, NavigatorIOS, StatusBar } from 'react-native';
import InTheaters from './scenes/InTheaters';
import Settings from './scenes/Settings';

export default class App extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      settings: {},
    };
  }

  /**
   * Render method
   * @return {Component}
   */
  render () {

    const route = {
      component: InTheaters,
      title: 'Í sýningu',
      rightButtonTitle: 'Stillingar',
      onRightButtonPress: () => this.refs.navigator.push({
        title: 'Stillingar',
        component: Settings,
      }),
    };

    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#83ad5c" translucent={true} barStyle="light-content" />
        <NavigatorIOS
          ref="navigator"
          barTintColor="#000"
          tintColor="#fff"
          titleTextColor="#fff"
          style={{ flex: 1 }}
          initialRoute={route} />
      </View>
    );
  }
}
