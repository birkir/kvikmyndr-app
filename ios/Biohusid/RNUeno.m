//
//  RNUeno.m
//
//  Created by Birkir Rafn Gudjonsson on 02/01/2018.
//  Copyright © 2018 Ueno. All rights reserved.
//
#import "ReactNativeNavigation.h"
#import "RNNRootViewController.h"
#import "RNUeno.h"

@import SafariServices;

#ifndef TARGET_OS_SIMULATOR
  #ifdef TARGET_IPHONE_SIMULATOR
    #define TARGET_OS_SIMULATOR TARGET_IPHONE_SIMULATOR
  #else
    #define TARGET_OS_SIMULATOR 0
  #endif
#endif

@implementation RNUeno

- (dispatch_queue_t) methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_MODULE()

- (BOOL) isSimulator {
  #if TARGET_OS_SIMULATOR
    return YES;
  #else
    return NO;
  #endif
}

RCT_EXPORT_METHOD(getConstantsForComponentId:(NSString *)componentId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  UIViewController *vc = [ReactNativeNavigation findViewController:componentId];
  NSObject *constants = @{
    @"topBarHeight": @(vc.navigationController.navigationBar.frame.size.height),
    @"statusBarHeight": @([UIApplication sharedApplication].statusBarFrame.size.height),
    @"bottomTabsHeight": @(vc.tabBarController.tabBar.frame.size.height)
  };
  resolve(constants);
}


RCT_EXPORT_METHOD(openSafari:(NSString *)componentId options:(NSDictionary *)options) {

  NSString* url = [options valueForKey:@"url"];
  NSNumber* readerMode = [options valueForKey:@"readerMode"];
  NSNumber* preferredBarTintColor = [options valueForKey:@"preferredBarTintColor"];
  NSNumber* preferredControlTintColor = [options valueForKey:@"preferredControlTintColor"];
  NSString* dismissButtonStyle = [options valueForKey:@"dismissButtonStyle"];

  UIViewController *vc = [ReactNativeNavigation findViewController:componentId];

  SFSafariViewController *safariViewController = [[SFSafariViewController alloc] initWithURL:[[NSURL alloc] initWithString:url] entersReaderIfAvailable:[readerMode boolValue]];

  if (preferredBarTintColor) {
    safariViewController.preferredBarTintColor = [RCTConvert UIColor:preferredBarTintColor];
  }

  if (preferredControlTintColor) {
    safariViewController.preferredControlTintColor = [RCTConvert UIColor:preferredControlTintColor];
  }

  if (@available(iOS 11.0, *)) {
    if ([dismissButtonStyle isEqualToString:@"done"]) {
      safariViewController.dismissButtonStyle = SFSafariViewControllerDismissButtonStyleDone;
    }
    if ([dismissButtonStyle isEqualToString:@"close"]) {
      safariViewController.dismissButtonStyle = SFSafariViewControllerDismissButtonStyleClose;
    }
    if ([dismissButtonStyle isEqualToString:@"cancel"]) {
      safariViewController.dismissButtonStyle = SFSafariViewControllerDismissButtonStyleCancel;
    }
  }

  (void)safariViewController.view;

  [vc.navigationController presentViewController:safariViewController animated:YES completion:nil];

  if ([vc isKindOfClass:[RNNRootViewController class]]) {
    RNNRootViewController* rootVc = (RNNRootViewController*)vc;
    [rootVc.eventEmitter sendComponentDidAppear:rootVc.componentId componentName:@"SAFARI_VIEW"];
  }
}

- (BOOL) isAppStoreReceiptSandbox {
  if (![NSBundle.mainBundle respondsToSelector:@selector(appStoreReceiptURL)]) {
    return NO;
  }

  NSURL *appStoreReceiptURL = NSBundle.mainBundle.appStoreReceiptURL;
  NSString *appStoreReceiptLastComponent = appStoreReceiptURL.lastPathComponent;
  BOOL isSandboxReceipt = [appStoreReceiptLastComponent isEqualToString:@"sandboxReceipt"];

  return isSandboxReceipt;
}

- (BOOL) hasEmbeddedMobileProvision {
  BOOL hasEmbeddedMobileProvision = !![[NSBundle mainBundle] pathForResource:@"embedded" ofType:@"mobileprovision"];
  return hasEmbeddedMobileProvision;
}

- (NSDictionary *)constantsToExport
{
  BOOL isSimulator = [self isSimulator];
  BOOL isTestFlight = [self isAppStoreReceiptSandbox];
  BOOL hasMobileProvision = [self hasEmbeddedMobileProvision];
  return @{
           @"isSimulator": @(isSimulator),
           @"isTestFlight": @(isTestFlight),
           @"hasMobileProvision": @(hasMobileProvision)
           };
}

@end
