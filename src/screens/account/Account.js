import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import FCM, { FCMEvent } from 'react-native-fcm';

export default class Account extends Component {

  componentDidMount() {
    FCM.requestPermissions()
      .then(() => console.log('granted'))
      .catch(() => console.log('notification permission rejected'));

    FCM.getFCMToken().then((token) => {
      console.log('FCM Token: %o', token);
    });

    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      console.log('Notification: %o', notif);
    });

    FCM.getInitialNotification()
      .then((notif) => {
        console.log('Initial notification %o', notif);
      });
  }

  render() {
    return (
      <View style={styles.host}>
        <Text style={styles.soon}>Coming soon</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  soon: {
    fontSize: 16,
    color: 'white',
  },
});
