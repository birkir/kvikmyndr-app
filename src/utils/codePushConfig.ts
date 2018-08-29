import { Platform } from 'react-native';
import CodePush, { CodePushOptions } from 'react-native-code-push';
import config from '../config';
import Store from '../store';

export default (): CodePushOptions => {
  const codePushConfig = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_START,
    installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  } as CodePushOptions;

  if (Platform.OS === 'ios' && Store.settings.isBeta) {
    codePushConfig.deploymentKey = config.IOS_CODEPUSH_DEPLOYMENT_KEY_STAGING;
    codePushConfig.installMode = CodePush.InstallMode.IMMEDIATE;
    codePushConfig.updateDialog = true as any;
  }

  if (Platform.OS === 'android' && Store.settings.isBeta) {
    codePushConfig.deploymentKey = config.ANDROID_CODEPUSH_DEPLOYMENT_KEY_STAGING;
    codePushConfig.installMode = CodePush.InstallMode.IMMEDIATE;
    codePushConfig.updateDialog = true as any;
  }

  return codePushConfig;
};
