import React, {
  Component,
  View,
  Navigator,
  StyleSheet,
  BackAndroid,
} from 'react-native';

import SceneMain from './scenes/Main';
import SceneDetail from './scenes/Detail';
import NavigationBar from 'react-native-navbar';
import Entypo from 'react-native-vector-icons/Entypo';

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

    // Default state
    this.state = {
      title: 'Í sýningu',
      showBack: false,
    };

    // Superbind methods
    this.renderScene = this.renderScene.bind(this);
    this.onWillFocus = this.onWillFocus.bind(this);
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
   * Fired before route will focus
   * @param {object} Route object
   * @return {void}
   */
  onWillFocus(route) {
    this.setState({
      title: route.title,
      showBack: (route.id !== 'main'),
      showFilters: (route.id === 'main'),
    });
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

    const {
      title,
      showBack,
      showFilters,
    } = this.state;

    let leftButton = undefined;
    let rightButton = undefined;

    if (showBack) {
      leftButton = {
        title: 'Back',
        tintColor: '#fff',
        handler: () => {
          this.refs.navigator.pop();
        },
      };
    }

    if (showFilters) {
      rightButton = (
        <View style={s.rightButton}>
          <Entypo name="eye" size={18} color="#fff" />
        </View>
      );
    }

    // Set default route
    const route = {
      component: SceneMain,
      id: 'main',
      title: 'Í sýningu',
    };

    return (
      <View style={s.flex}>
        <View style={s.flex}>
          <NavigationBar
            statusBar={{ style: 'light-content' }}
            tintColor="#000"
            title={{ title, tintColor: '#fff' }}
            {...{ leftButton, rightButton }}
          />
          <Navigator
            ref="navigator"
            style={s.flex}
            initialRoute={route}
            onWillFocus={this.onWillFocus}
            renderScene={this.renderScene}
          />
        </View>
      </View>
    );
  }
}

/**
 * @const {StyleSheet} Component styles
 */
s = StyleSheet.create({
  flex: {
    flex: 1,
  },

  rightButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    paddingRight: 10,
  },
});
