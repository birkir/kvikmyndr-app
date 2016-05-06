import React, {
  Component,
  View,
  Navigator,
  StyleSheet,
  BackAndroid,
  TouchableHighlight,
} from 'react-native';

import SceneMain from './scenes/Main';
import NavigationBar from 'react-native-navbar';
import LinearGradient from 'react-native-linear-gradient'; // eslint-disable-line
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    this.onRightPress = this.onRightPress.bind(this);
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
    // Fetch title
    let title = route.title;

    // Get title from route
    if (route.hasOwnProperty('getTitle')) {
      title = route.getTitle();
    }

    // Update state for navbar
    this.setState({
      title,
      showBack: (route.id !== 'main'),
      showFilters: (route.id === 'main'),
    });
  }

  /**
   * Fired when right button is pressed
   * @param {object} Event
   * @return {void}
   */
  onRightPress(e) {
    if (this.scene && this.scene.onFiltersPress) {
      // Proxy event if defined in scene
      this.scene.onFiltersPress(e);
    }
  }

  /**
   * Render scene method for standard Navigator
   * @param {object} Route to render
   * @param {Navigator}
   * @return {Component}
   */
  renderScene(route, navigator) {
    const { passProps = {} } = route;
    const Scene = route.component;

    // Attach navigator and set scene reference
    passProps.navigator = navigator;
    passProps.ref = c => this.scene = c; // eslint-disable-line

    // Render scene
    if (Scene) {
      return <Scene {...passProps} />;
    }

    // Fallback for other routes
    if (route.hasOwnProperty('renderScene')) {
      return route.renderScene(navigator);
    }
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {

    // Deconstruct wanted properties from state
    const {
      title,
      showBack,
      showFilters,
    } = this.state;

    // TODO: Move to their own components
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
        <TouchableHighlight
          underlayColor="rgba(255,255,255,0.1)"
          onPress={this.onRightPress}
        >
          <View style={s.rightButton}>
            <Icon name="sort" size={24} color="#fff" />
          </View>
        </TouchableHighlight>
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
        <LinearGradient
          start={[0.0, 1.0]}
          end={[1.0, 0.0]}
          locations={[0, 1.0]}
          colors={['#992D72', '#D94C83']}
          style={{ top: 0, left: 0, right: 0, height: 112, position: 'absolute' }}
        />
        <NavigationBar
          tintColor="transparent"
          statusBar={{ style: 'light-content' }}
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
    );
  }
}

/**
 * @const {StyleSheet} Component styles
 */
const s = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  rightButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    paddingRight: 10,
    paddingLeft: 10,
  },
});
