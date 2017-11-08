import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist';

export default class Auth {

  @action
  async signin() {
    try {
      this.error = null;
    } catch (err) {
      this.error = err;
    }
    return !this.error;
  }

  @action
  async logout() {
    this.token = null;
  }

  @persist('object')
  @observable
  token = null;

  @computed
  get isSignedIn() {
    return !!this.token;
  }
}
