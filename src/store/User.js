import { Platform } from 'react-native';
import { observable, computed } from 'mobx';
import { autobind } from 'core-decorators';
import OAuthManager from 'react-native-oauth';
import _get from 'lodash/get';
import env from '../utils/env';

export default class User {

  constructor(store) {
    this.firestack = store.firestack;

    // Listen for auth changes
    this.firestack.auth.listenForAuth(this.onAuthStateChanged);

    this.manager = new OAuthManager('biohusid');
    this.manager.configure(env.providers);

    this.savedAccounts();
  }

  @autobind
  savedAccounts() {
    this.manager.savedAccounts()
    .then(this.onSavedAccounts);
  }

  @autobind
  onAuthStateChanged({ authenticated, user }) {
    this.isAuthenticated = authenticated;
    const ref = this.firestack.database.ref('users');

    if (authenticated) {
      this.user = user;
      if (!this.profileRef) {
        this.profileRef = ref.child(user.uid)
        .on('value', s => (this.profile = s.val()));
      }
    } else if (this.profileRef && this.profileRef.off) {
      this.profileRef.off();
    }
  }

  @autobind
  onSavedAccounts(res) {
    const { accounts = [] } = res;
    this.providers = accounts;
    const account = accounts.find(() => true);
    if (account) {
      const { provider, response: { credentials: { accessToken, clientSecret } } } = account;
      this.firestack.auth.signInWithProvider(provider, accessToken, clientSecret);
    }
  }

  @autobind
  authorize(provider, opts) {
    this.manager.authorize(provider, opts)
    .then(this.savedAccounts);
  }

  @autobind
  deauthorize(provider) {
    this.manager.deauthorize(provider)
    .then(this.savedAccounts);
  }

  @autobind
  signOut() {
    this.providers.forEach(({ provider }) => this.deauthorize(provider));
    return this.firestack.auth.signOut();
  }

  @observable
  isAuthenticated = false;

  @observable
  user = null;

  @observable
  profile = {};

  @observable
  providers = [];

  @observable
  notifications = [];

  @computed
  get codePush() {
    const conf = {};
    const keyType = _get(this.profile, 'codePush.type', 'production');
    const fallbackKey = _get(env, `deployementKeys.${keyType}.${Platform.OS}`);
    const key = _get(this.profile, `codePush.${Platform.OS}`, fallbackKey);
    if (key) {
      conf.deployementKey = key;
    }
    return conf;
  }

  toggleNotificationForMovie(id) {
    const index = this.notifications.indexOf(id);
    if (index >= 0) {
      this.notifications.splice(index, 1);
    } else {
      this.notifications.push(id);
    }
  }

  isNotificationForMovie(id) {
    return (this.notifications.indexOf(id) >= 0);
  }

}
