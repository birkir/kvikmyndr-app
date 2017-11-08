package com.solidmobile.kvikmyndr;

import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import com.reactnativenavigation.NavigationApplication;
import com.github.droibit.android.reactnative.customtabs.CustomTabsPackage;
import com.microsoft.codepush.react.CodePush;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import fr.aybadb.rnak.RNAKPackage;
import com.evollu.react.fcm.FIRMessagingPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
          new CustomTabsPackage(),
          new CodePush(BuildConfig.CODE_PUSH_ANDROID, MainApplication.this, BuildConfig.DEBUG),
          new ReactNativeConfigPackage(),
          new RNAKPackage(),
          new FIRMessagingPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

    // MainApplication class
    @Override
    public void onCreate() {
      super.onCreate();
      SoLoader.init(this, false);
    }
}
