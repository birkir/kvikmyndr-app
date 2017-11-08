import { observable, action, computed } from 'mobx';

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

  @observable
  token = null;

  @computed
  get isSignedIn() {
    return !!this.token;
  }
}
