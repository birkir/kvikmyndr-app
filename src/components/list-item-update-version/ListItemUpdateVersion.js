import React, { Component } from 'react';
import CodePush from 'react-native-code-push';
import { autobind } from 'core-decorators';
import { Item } from 'components/list';
import { observer } from 'mobx-react/native';
import { computed, observable } from 'mobx';
import store from 'store';
import _get from 'lodash/get';

@CodePush({ checkFrequency: CodePush.CheckFrequency.MANUAL })
@observer
export default class ListItemUpdateVersion extends Component {

  componentDidMount() {
    this.getUpdateMetadata();
  }

  @autobind
  onPress() {
    CodePush.sync({
      ...store.user.codePush,
    }, this.codePushStatusDidChange, this.codePushDownloadDidProgress);
  }

  async getUpdateMetadata() {
    try {
      this.metadata = await CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING);
    } catch (err) {
      this.metadata = `Error: ${err}`;
    }
    this.progress = false;
  }

  @observable
  metadata;

  @observable
  syncStatus;

  @observable
  progress;

  @computed
  get progressFormatted() {
    if (!this.progress) return '';
    const { receivedBytes, totalBytes } = this.progress;
    return ` (${((receivedBytes / totalBytes) * 100).toFixed(2)}%)`;
  }

  @computed
  get syncMessage() {
    switch (this.syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE: return 'Checking for update';
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE: return `Downloading package${this.progressFormatted}`;
      case CodePush.SyncStatus.AWAITING_USER_ACTION: return 'Awaiting user action.';
      case CodePush.SyncStatus.INSTALLING_UPDATE: return `Installing update.${this.progressFormatted}`;
      case CodePush.SyncStatus.UP_TO_DATE: return 'App up to date.';
      case CodePush.SyncStatus.UPDATE_IGNORED: return 'Checking for update.';
      case CodePush.SyncStatus.UPDATE_INSTALLED: return 'Checking for update.';
      case CodePush.SyncStatus.UNKNOWN_ERROR: return 'An unknown error occurred.';
      default: return false;
    }
  }

  @computed
  get version() {
    // Check for type
    const profile = store.user.profile;
    const type = _get(profile, 'codePush.type', '');
    if (this.metadata && this.metadata.appVersion) {
      const { appVersion, packageHash } = this.metadata;
      return `${appVersion}-${packageHash.slice(0, 7)}${type ? `-${type}` : ''}`;
    }
    return '2.0.1';
  }

  @autobind
  codePushStatusDidChange(syncStatus) {
    this.syncStatus = syncStatus;
    switch (syncStatus) {
      case CodePush.SyncStatus.UP_TO_DATE:
      case CodePush.SyncStatus.UPDATE_IGNORED:
      case CodePush.SyncStatus.UPDATE_INSTALLED:
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.progress = false;
        setTimeout(() => (this.syncStatus = false), 5000);
        break;
      default:
    }
  }

  @autobind
  codePushDownloadDidProgress(progress) {
    this.progress = progress;
  }

  render() {
    return (
      <Item
        label={store.UI.i18n.VERSION}
        value={this.syncMessage || this.version}
        onPress={this.onPress}
      />
    );
  }
}
