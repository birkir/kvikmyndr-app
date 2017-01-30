export default {
  providers: {
    github: {},
    facebook: {},
    google: {},
  },
  firebase: {
    debug: '*',
    apiKey: '',
    authDomain: '.firebaseapp.com',
    databaseURL: 'https://.firebaseio.com',
    storageBucket: '.appspot.com',
  },
  codePush: {
    checkFrequency: 1, // CodePush.CheckFrequency.ON_APP_RESUME
    installMode: 2, // CodePush.InstallMode.ON_NEXT_RESUME
    updateDialog: true,
  },
};
