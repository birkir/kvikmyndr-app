import { observable, action, computed } from 'mobx';
import { persist } from 'mobx-persist';
// import Auth0 from 'react-native-auth0';
// import config from '../config';

// const auth0 = new Auth0({
//   domain: config.AUTH0_DOMAIN,
//   clientId: config.AUTH0_CLIENT_ID,
// });

export default class Auth {

  @action
  async signin() {
    try {
      // const token = await auth0.webAuth.authorize({
      //   scope: 'openid email',
      //   audience: `https://${config.AUTH0_DOMAIN}/userinfo`,
      // });
      this.error = null;
      // this.token = token;
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
