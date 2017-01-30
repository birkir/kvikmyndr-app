import { observable } from 'mobx';
import { autobind } from 'core-decorators';
import OAuthManager from 'react-native-oauth';
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
    if (authenticated) {
      this.user = user;
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
  providers = [];

  @observable
  notifications = [];

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
