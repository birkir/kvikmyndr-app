import * as React from 'react';
import { ScrollView, Switch, Platform, ActionSheetIOS, Alert, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';
import CellGroup from 'components/cell/CellGroup';
import Cell from 'components/cell/Cell';
import { Options } from 'types/Options';
import { Store } from 'store';
import { Languages, Browsers } from 'store/models/Settings';
import { autobind } from 'core-decorators';
import codePushConfig from 'utils/codePushConfig';
import CodePush, { DownloadProgress, RemotePackage } from 'react-native-code-push';
import { Update } from 'store/update';
import { observable, computed } from 'mobx';
const styles = require('./Settings.css');

interface IProps {
  componentId: string;
  imageUrl: string;
}

const switchConfig = {
  onTintColor: '#ff2244',
  trackColor: '#ff2244',
};

@observer
export default class Settings extends React.Component<IProps> {

  static get options() {
    return {
      topBar: {
        title: {
          text: 'Settings',
          color: '#FFFFFF',
        },
        background: {
          color: '#000000',
        },
        buttonColor: '#FF2244',
      },
      bottomTab: {
        testID: 'SETTINGS_TAB',
        text: 'Settings',
        iconColor: '#FFFFFF',
        textColor: '#FFFFFF',
        selectedTextColor: '#FF2244',
        selectedIconColor: '#FF2244',
        icon: require('../../assets/icons/adjust.png'),
        selectedIcon: require('../../assets/icons/adjust-filled.png'),
      },
      layout: {
        backgroundColor: '#000000',
      },
      bottomTabs: {
        translucent: false,
        barStyle: 'black',
        drawBehind: true,
        backgroundColor: '#000000',
      },
    } as Options;
  }

  @observable
  private progress: number | null = null;

  @observable
  private isUpdating: boolean = false;

  @computed
  get updateDisplay() {
    if (this.progress !== null) {
      return `${(this.progress * 100).toFixed(1)}%`;
    }

    if (this.isUpdating) {
      return <ActivityIndicator />;
    }

    return Update.updateVersion;
  }

  onLanguagePress() {
    const options = [...Object.values(Languages), 'Cancel'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      },
      (index: number) => {
        if (index < options.length) {
          Store.settings.setLanguage(Object.keys(Languages)[index]);
        }
      },
    );
  }

  onBrowserPress() {
    const options = [...Object.values(Browsers), 'Cancel'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      },
      (index: number) => {
        if (index < options.length) {
          Store.settings.setBrowser(Object.keys(Browsers)[index]);
        }
      },
    );
  }

  @autobind
  onBetaChange(flag: boolean) {
    Store.settings.setIsBeta(flag);
    const config = codePushConfig();
    config.installMode = CodePush.InstallMode.IMMEDIATE;
    CodePush.sync(config);
  }

  @autobind
  onDownloadProgress({ totalBytes, receivedBytes }: DownloadProgress) {
    this.progress = receivedBytes / totalBytes;
  }

  @autobind
  onBinaryVersionMismatch(update: RemotePackage) {
    Alert.alert('New version available in AppStore');
  }

  @autobind
  async onCodePushPress() {
    this.isUpdating = true;

    const config = codePushConfig();
    config.installMode = CodePush.InstallMode.IMMEDIATE;
    const update = await CodePush.sync(config, undefined, this.onDownloadProgress, this.onBinaryVersionMismatch);

    this.isUpdating = false;
    this.progress = null;

    switch (update) {
      case CodePush.SyncStatus.UP_TO_DATE:
        Alert.alert('No update available');
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        Alert.alert('Unknown error');
        break;
    }
  }

  render() {
    return (
      <ScrollView style={styles.host}>
        <CellGroup header="General">
          <Cell
            title="Language"
            value={Store.settings.languageDisplay}
            onPress={this.onLanguagePress}
          />
          <Cell
            title="Hide Synopsis"
            value={(
              <Switch
                value={Store.settings.hideSynopsis}
                onValueChange={Store.settings.setHideSynopsis}
                {...switchConfig}
              />
            )}
          />
        </CellGroup>
        <CellGroup header="Appearance">
          <Cell
            title="Hide Bars On Scroll"
            value={(
              <Switch
                value={Store.settings.hideDaysOnScroll}
                onValueChange={Store.settings.setHideDaysOnScroll}
                {...switchConfig}
              />
            )}
          />
          <Cell
            title="Enable Poster Animations"
            value={(
              <Switch
                value={Store.settings.posterAnimation}
                onValueChange={Store.settings.setPosterAnimation}
                {...switchConfig}
              />
            )}
          />
        </CellGroup>
        <CellGroup header="Browser">
          {Platform.OS === 'ios' && (
            <Cell
              title="Always Use Reader Mode"
              value={<Switch
                value={Store.settings.useReaderMode}
                onValueChange={Store.settings.setUseReaderMode}
                {...switchConfig}
              />}
            />
          )}
          <Cell
            title="Open Links In"
            value={Store.settings.browserDisplay}
            onPress={this.onBrowserPress}
          />
        </CellGroup>
        <CellGroup header="About">
          <Cell
            title="Version"
            value={Update.appVersion}
          />
          <Cell
            title="Check for Update"
            subtitle={Update.updateDescription}
            value={this.updateDisplay}
            onPress={this.onCodePushPress}
          />
          {Platform.OS === 'android' && (
            <Cell
              title="Opt-in to Beta"
              value={<Switch
                value={Store.settings.isBeta}
                onValueChange={this.onBetaChange}
                {...switchConfig}
              />}
            />
          )}
          {Platform.OS === 'ios' && Store.settings.isBeta && (
            <Cell
              title="Beta"
              value="Yes"
            />
          )}
        </CellGroup>
      </ScrollView>
    );
  }
}
