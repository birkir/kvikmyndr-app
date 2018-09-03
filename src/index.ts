import { Navigation } from 'react-native-navigation';
import { YellowBox, Platform, UIManager } from 'react-native';
import { Screens, startApp } from './screens';
import theme from 'theme';
import Store from 'store';

YellowBox.ignoreWarnings([
  'Required dispatch_sync to load constants for CodePush. This may lead to deadlocks',
  'RCTBridge required dispatch_sync to load CodePush. This may lead to deadlocks',
]);

// Include devtools
if (__DEV__) {
  const { connectToDevTools } = require('mobx-devtools/lib/mobxDevtoolsBackend.js');
  connectToDevTools({ host: 'localhost', port: '8098' });

  // XMLHttpRequest = (global as any).originalXMLHttpRequest || (global as any).XMLHttpRequest;
}

// Enable LayoutAnimation on android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
// Register screens
Screens.forEach((ScreenComponent, key) =>
  Navigation.registerComponent(key, () => ScreenComponent));

// Start application
Navigation.events().registerAppLaunchedListener(() => {

  // Hydrate store and start app
  Store.hydrate()
  .then(theme.update)
  .then(startApp);
});
