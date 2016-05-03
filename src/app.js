import React, {
  Component,
  View,
  Navigator,
  NavigatorIOS,
  StatusBar,
  StyleSheet,
  Platform,
  BackAndroid,
} from 'react-native';

import SceneMain from './scenes/Main';
import SceneDetail from './scenes/Detail';
import NavigationBar from './components/NavigationBar';
let s = {};

/**
 * App container component
 * @return {Component}
 */
export default class App extends Component {

  /**
   * Constructor proxy, default state, superbinds.
   * @return {void}
   */
  constructor(...args) {
    super(...args);
    this.state = {};

    // Superbind methods
    this.renderScene = this.renderScene.bind(this);
    this.navigationBar = this.navigationBar.bind(this);
  }

  /**
   * Fired when component will mount
   * @return {void}
   */
  componentDidMount() {
    // Overtake hardware back presses in android
    BackAndroid.addEventListener('hardwareBackPress', this.hwBackRef = () => {
      if (this.refs.navigator) {
        const routes = this.refs.navigator.getCurrentRoutes();
        if (routes.length > 1) {
          // Go back one route
          this.refs.navigator.pop();
          return true;
        }
      }
      // Defaults to exit app
      return false;
    });
  }

  /**
   * Fired when component will unmount
   * @return {void}
   */
  componentWillUnmount() {
    // Remove hardware back press listener that was set in didMount.
    BackAndroid.removeEventListener('hardwareBackPress', this.hwBackRef);
  }

  /**
   * Render scene method for standard Navigator
   * @param {object} Route to render
   * @param {Navigator}
   * @return {Component}
   */
  renderScene(route, navigator) {
    const { id, passProps } = route;

    switch (id) {

      // Main scene
      default:
        return <SceneMain navigator={navigator} {...passProps} />;

      // Movie details
      case 'detail':
        return <SceneDetail navigator={navigator} {...passProps} />;
    }
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {

    // Set default route
    const route = {
      component: SceneMain,
      title: 'Í sýningu',
    };

    return (
      <View style={s.flex}>
        <StatusBar {...s.statusBar} />
        {Platform.OS === 'ios' ? (
          <NavigatorIOS
            barTintColor="#000"
            tintColor="#fff"
            titleTextColor="#fff"
            style={s.flex}
            initialRoute={route}
          />
        ) : (
          <View style={s.flex}>
            <NavigationBar title="Í sýningu" />
            <Navigator
              ref="navigator"
              style={s.flex}
              initialRoute={route}
              renderScene={this.renderScene}
            />
          </View>
        )}
      </View>
    );
  }
}

s = StyleSheet.create({

  flex: {
    flex: 1,
  },

  statusBar: {
    backgroundColor: '#000000',
    translucent: true,
    barStyle: 'light-content',
  },

});
