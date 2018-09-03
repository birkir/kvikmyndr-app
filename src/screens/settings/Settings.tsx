import * as React from 'react';
import { ScrollView, Switch, Platform, Alert, ActivityIndicator } from 'react-native';
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
import { openActionSheet } from 'utils/openActionSheet';
import { Navigation } from 'react-native-navigation';
const styles = require('./Settings.css');

interface IProps {
  componentId: string;
  imageUrl: string;
}

const switchConfig = Platform.select({
  ios: {
    onTintColor: '#ff2244',
    trackColor: '#ff2244',
  },
  android: {
    onTintColor: 'rgba(255, 34, 68, 0.5)',
    trackColor: 'rgba(255, 34, 68, 0.5)',
    thumbTintColor: '#ff2244',
  },
});

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
        leftButtons: Platform.select({
          android: [{
            id: 'ICON_MENU',
            icon: require('../../assets/icons/menu.png'),
            text: 'Menu',
            color: '#FFFFFF',
          }],
          ios: [],
        }),
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

  events = Navigation.events().bindComponent(this);

  componentWillUnmount() {
    this.events.remove();
  }

  @autobind
  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'ICON_MENU') {
      Navigation.mergeOptions(Store.menuComponentId, {
        sideMenu: {
          left: {
            visible: true,
          },
        },
      });
    }
  }

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
    openActionSheet({
      options: Object.entries(Languages),
      selectedId: Store.settings.language,
      cancel: true,
      type: 'radio',
      onSelect(option: any) {
        Store.settings.setLanguage(option[0]);
      },
    });
  }

  onBrowserPress() {
    openActionSheet({
      options: Object.entries(Browsers),
      selectedId: Store.settings.browser,
      cancel: true,
      type: 'radio',
      onSelect(option: any) {
        Store.settings.setBrowser(option[0]);
      },
    });
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
    Alert.alert('New version available in AppStore', update.description);
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
