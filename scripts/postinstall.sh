git apply --directory=node_modules/react-native-navigation ./scripts/react-native-navigation.patch
# git apply --directory=node_modules/react-native-navigation ./scripts/navigation-dark-blur.patch
git apply --directory=node_modules/react-native-android-kit ./scripts/react-native-android-kit.patch
git apply --directory=node_modules/isomorphic-fetch ./scripts/isomorphic-fetch.patch

# Generate dotenv
touch ./ios/Config/GeneratedInfoPlistDotEnv.h
sh ./scripts/dotenv.sh

# Pod install
(cd ios; pod install; cd -)
