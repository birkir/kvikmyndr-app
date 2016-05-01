import React, {
  Component,
  View,
  Text,
  Navigator,
  NavigatorIOS,
  StatusBar,
  StyleSheet,
  Platform,
  BackAndroid,
} from 'react-native';

import InTheaters from './scenes/InTheaters';
import MovieDetails from './scenes/MovieDetails';

export default class App extends Component {

  constructor(...args) {
    super(...args);
    this.state = {};
    this.renderScene = this.renderScene.bind(this);
    this.navigationBar = this.navigationBar.bind(this);
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.hwBackRef = () => {
      if (this.refs.navigator) {
        const routes = this.refs.navigator.getCurrentRoutes();
        if (routes.length > 1) {
          this.refs.navigator.pop();
          return true;
        }
      }
      return false;
    });
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.hwBackRef);
  }

  navigationBar(navigator, navState) {
    return (
      <View style={s.navbar}>
        <Text style={s.navbarTitle}>Í sýningu</Text>
      </View>
    );
  }

  renderScene(route, navigator) {
    if (route.name === 'InTheaters') {
      return <InTheaters navigator={navigator} />;
    }

    if (route.name === 'MovieDetails') {
      return <MovieDetails navigator={navigator} {...route.passProps} />
    }
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {

    const route = {
      name: 'InTheaters',
      component: InTheaters,
      title: 'Í sýningu',
    };

    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#000" translucent={true} barStyle="light-content" />
        {Platform.OS === 'ios' ? (
          <NavigatorIOS
            barTintColor="#000"
            tintColor="#fff"
            titleTextColor="#fff"
            style={{ flex: 1 }}
            initialRoute={route}
          />
        ) : (
          <View style={{ flex: 1 }}>
            {this.navigationBar()}
            <Navigator
              ref="navigator"
              style={{ flex: 1 }}
              initialRoute={route}
              renderScene={this.renderScene}
            />
          </View>
        )}
      </View>
    );
  }
}

const s = StyleSheet.create({
  navbar: {
    marginTop: 24,
    height: 50,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '400',
  },
});
