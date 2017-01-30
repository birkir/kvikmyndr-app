import { PixelRatio, Dimensions } from 'react-native';

export function isTablet() {
  const { width, height } = Dimensions.get('window');
  const pixelDensity = PixelRatio.get();
  const w = width * pixelDensity;
  const h = height * pixelDensity;

  if (pixelDensity < 2 && (w >= 1000 || h >= 1000)) {
    return true;
  }

  if (pixelDensity === 2 && (w >= 1920 || h >= 1920)) {
    return true;
  }

  return false;
}

export default {};
