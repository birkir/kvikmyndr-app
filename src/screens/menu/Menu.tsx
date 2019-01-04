import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import { Navigation } from 'react-native-navigation';
import { COMING_SOON, WEEK, SETTINGS } from 'screens';
import { Store } from 'store';
const styles = require('./Menu.css');

interface IProps {
  componentId: string;
}

@observer
export default class Menu extends React.Component<IProps> {

  state = {
    selected: 0,
  };

  componentDidMount() {
    Store.setMenuComponentId(this.props.componentId);
  }

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
    this.setState({ selected: 0 });
    Navigation.setStackRoot('CENTER', {
      component: {
        name: WEEK,
      },
    });
  }

  @autobind
  onComingSoonPress() {
    this.hideMenu();
    this.setState({ selected: 1 });
    Navigation.setStackRoot('CENTER', {
      component: {
        name: COMING_SOON,
      },
    });
  }

  @autobind
  onSettingsPress() {
    this.hideMenu();
    this.setState({ selected: 2 });
    Navigation.setStackRoot('CENTER', {
      component: {
        name: SETTINGS,
      },
    });
  }

  render() {
    const { selected } = this.state;
    return (
      <View style={styles.host}>
        <View style={styles.header}>
          <Text style={styles.header__title}>Bíóhúsið</Text>
          {/* <Text style={styles.header__subtitle}>Navigation</Text> */}
        </View>
        <TouchableOpacity style={[styles.item, selected === 0 && styles.item__active]} onPress={this.onWeekPress}>
          <Text style={styles.item__label}>{Store.settings.locale.IN_THEATERS}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, selected === 1 && styles.item__active]} onPress={this.onComingSoonPress}>
          <Text style={styles.item__label}>{Store.settings.locale.COMING_SOON}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, selected === 2 && styles.item__active]} onPress={this.onSettingsPress}>
          <Text style={styles.item__label}>{Store.settings.locale.SETTINGS}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
