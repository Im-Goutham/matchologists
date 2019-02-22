/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNFIRMessaging.h"

#import "AppDelegate.h"
#import <AppCenterReactNativePush/AppCenterReactNativePush.h>
#import <AppCenterReactNativeCrashes/AppCenterReactNativeCrashes.h>
#import <AppCenterReactNativeAnalytics/AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNative/AppCenterReactNative.h>
//#import <react-native-branch/RNBranch.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <React/RCTPushNotificationManager.h>
#import "RNSplashScreen.h"



@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GIDSignIn sharedInstance].clientID = @"984386186860-qv2koo0b98mp88uihgnu3hba37mbnjl3.apps.googleusercontent.com";
  [GIDSignIn sharedInstance].serverClientID = @"984386186860-qv2koo0b98mp88uihgnu3hba37mbnjl3.apps.googleusercontent.com";

  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];

  NSURL *jsCodeLocation;

  [AppCenterReactNativePush register];  // Initialize AppCenter push

  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];  // Initialize AppCenter crashes

  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];  // Initialize AppCenter analytics

  [AppCenterReactNative register];  // Initialize AppCenter 

 [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];


  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"matchologists"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [RNSplashScreen show];  // here
  return YES;
}
//fire base notification
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
  
}
#if defined(__IPHONE_11_0)
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
  
}
#else
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void(^)())completionHandler
{
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
  
}
#endif
//You can skip this method if you don't want to use local notification
-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RNFIRMessaging didReceiveLocalNotification:notification];
  
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  
}
//fire base notification

- (BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance]
                  application:application openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                  annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                  ];
  // Add any custom logic here.
  BOOL googlehandle = [RNGoogleSignin application:application
                                          openURL:url
                                sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                       annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
  return handled || googlehandle;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

 // Required to register for notifications
// - (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
// {
//  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
// }
// // Required for the register event.
// - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
// {
//  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
// }
// // Required for the notification event. You must call the completion handler after handling the remote notification.
// - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
// {
//   [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
// }
// // Required for the registrationError event.
// - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
// {
//  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
// }
// // Required for the localNotification event.
// - (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
// {
//  [RCTPushNotificationManager didReceiveLocalNotification:notification];
// }




@end
