import { Linking } from 'react-native';
import { CustomTabs, ANIMATIONS_SLIDE } from 'react-native-custom-tabs';

export default async (url, options = {}) => {

  let success = false;

  try {
    success = await CustomTabs.openURL(url, {
      toolbarColor: '#000000',
      enableUrlBarHiding: true,
      showPageTitle: true,
      enableDefaultShare: true,
      animations: ANIMATIONS_SLIDE,
      ...options,
    });
  } catch (err) {
    // console.log('Error opening URL', err);
  }

  if (!success) {
    if (await Linking.canOpenURL(url)) {
      return Linking.openURL(url);
    }
  }

  return success;
};
