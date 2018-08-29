./scripts/build-env.sh

rm -rf ./node_modules/react-native-navigation/lib/android/app/src/main/java/com/reactnativenavigation/react/NavigationReactNativeHost.java

# Pod install
if [ -z "$APPCENTER_BUILD_ID" ]; then
  (cd ios; pod install; cd -)
fi
