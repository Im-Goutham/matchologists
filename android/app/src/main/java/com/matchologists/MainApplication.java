package com.matchologists;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.henninghall.date_picker.DatePickerPackage;
import io.branch.rnbranch.RNBranchPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import cl.json.RNSharePackage;
import com.imagepicker.ImagePickerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.actionsheet.ActionSheetPackage;
import com.microsoft.appcenter.reactnative.push.AppCenterReactNativePushPackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.opentokreactnative.OTPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactVideoPackage(),
            new RNGeocoderPackage(),
            new DatePickerPackage(),
            new RNBranchPackage(),
            new RNFetchBlobPackage(),
            new RNSharePackage(),
            new ImagePickerPackage(),
            new SplashScreenReactPackage(),
            new FIRMessagingPackage(),
            new ActionSheetPackage(),
            new AppCenterReactNativePushPackage(MainApplication.this),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this),
            new ExtraDimensionsPackage(),
            new RNGoogleSigninPackage(),
            new LottiePackage(),
            new LinearGradientPackage(),
            new RNI18nPackage(),
            new OTPackage(),
            new FBSDKPackage(mCallbackManager)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
