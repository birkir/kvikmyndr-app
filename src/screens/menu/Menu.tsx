import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import { Navigation } from 'react-native-navigation';
import { COMING_SOON, WEEK } from 'screens';
const styles = require('./Menu.css');

interface IProps {
  componentId: string;
}

@observer
export default class Menu extends React.Component<IProps> {

  hideMenu() {
    Navigation.mergeOptions(this.props.componentId, {
      sideMenu: {
        left: {
          visible: false,
        },
      },
    });
  }

  @autobind
  onWeekPress() {
    this.hideMenu();
    Navigation.setStackRoot('CENTER', {
      component: {
        name: WEEK,
      },
    });
  }

  @autobind
  onComingSoonPress() {
    this.hideMenu();
    Navigation.setStackRoot('CENTER', {
      component: {
        name: COMING_SOON,
      },
    });
  }

  render() {
    return (
      <View style={styles.host}>
        <TouchableOpacity onPress={this.onWeekPress}>
          <Text>WEEK</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onComingSoonPress}>
          <Text>COMING SOON</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
