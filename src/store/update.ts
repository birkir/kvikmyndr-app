import { types, flow } from 'mobx-state-tree';
import CodePush from 'react-native-code-push';
import VersionNumber from 'react-native-version-number';
import { UpdateMetadata } from './models/UpdateMetadata';

export const Update = types
  .model('Update', {
    updateMetadata: types.maybe(UpdateMetadata),
    version: VersionNumber.appVersion,
    build: VersionNumber.buildVersion,
  })
  .views(self => ({
    get updateDescription() {
      const { description = null } = self.updateMetadata || {};
      return description;
    },
    get updateVersion() {
      const { label = null } = self.updateMetadata || {};
      return label;
    },
    get appVersion() {
      return `${self.version || 'unknown'}${self.build ? ` (build ${self.build})` : ''}`;
    },
  }))
  .actions(self => ({
    update() {
      return flow(function* () {
        self.updateMetadata = yield CodePush.getUpdateMetadata();
      })();
    },
  }))
  .create();

// Update CodePush
Update.update();
