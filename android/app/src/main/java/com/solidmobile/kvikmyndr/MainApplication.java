package com.solidmobile.kvikmyndr;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;
import java.util.Arrays;
import java.util.List;

// React Native
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

// React Native Navigation
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

// MerryPhotoView
import com.facebook.drawee.backends.pipeline.DraweeConfig;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.imagepipeline.decoder.SimpleProgressiveJpegConfig;

// Ueno RNS: Include Libraries here
import com.microsoft.codepush.react.CodePush;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.sentry.RNSentryPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.github.droibit.android.reactnative.customtabs.CustomTabsPackage;
import com.merryjs.PhotoViewer.MerryPhotoViewPackage;

public class MainApplication extends NavigationApplication {

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @javax.annotation.Nullable
            @Override
            protected String getJSBundleFile() {
                return CodePush.getJSBundleFile();
            }
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };

        ImagePipelineConfig config = ImagePipelineConfig.newBuilder(this)
                .setProgressiveJpegConfig(new SimpleProgressiveJpegConfig())
                .setResizeAndRotateEnabledForNetwork(true)
                .setDownsampleEnabled(true)
                .build();

        Fresco.initialize(this);

        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    // Add custom packages here
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
          new CodePush(BuildConfig.ANDROID_CODEPUSH_DEPLOYMENT_KEY, MainApplication.this, BuildConfig.DEBUG),
          new ReactNativeConfigPackage(),
          new RNVersionNumberPackage(),
          new RNGestureHandlerPackage(),
          new ReanimatedPackage(),
          new LinearGradientPackage(),
          new CustomTabsPackage(),
          new MerryPhotoViewPackage(),
          new RNSentryPackage(),
          new RNFirebasePackage(),
          new RNFirebaseAnalyticsPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}

