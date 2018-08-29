import { NativeModules, Platform, PixelRatio } from 'react-native';
import { Navigation } from 'react-native-navigation';

export async function getConstants(componentId: string) {
  if (Platform.OS === 'ios') {
    return NativeModules.RNUeno.getConstantsForComponentId(componentId);
  }

  return Navigation.constants();
}

export async function getInsets(componentId: string) {
  const constants = await getConstants(componentId);
  const insets = {
    top: constants.topBarHeight,
    bottom: constants.bottomTabsHeight,
    calculated: true,
  };

  if (Platform.OS === 'android') {
    insets.top = constants.topBarHeight / PixelRatio.get();
    insets.bottom = insets.top;
  }

  if (Platform.OS === 'ios') {
    insets.top = constants.statusBarHeight + constants.topBarHeight;
  }

  return insets;
}
