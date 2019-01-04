import { Linking, Platform, NativeModules, processColor } from 'react-native';
import { CustomTabs, ANIMATIONS_SLIDE } from 'react-native-custom-tabs';
import Store from '../store';

export function openUrl(url: string) {
  if (Store.settings.browser === 'default') {
    return Linking.openURL(url);
  }

  if (Platform.OS === 'ios') {
    return NativeModules.RNUeno.openSafari(Store.componentId, {
      url,
      readerMode: Store.settings.useReaderMode,
      preferredBarTintColor: processColor('#000000'),
      preferredControlTintColor: processColor('#FF2244'),
    });
  }

  if (Platform.OS === 'android') {
    return CustomTabs.openURL(url, {
      toolbarColor: '#000000',
      animations: ANIMATIONS_SLIDE,
      enableUrlBarHiding: true,
      showPageTitle: true,
      enableDefaultShare: true,
    });
  }

  return Linking.openURL(url);
}
