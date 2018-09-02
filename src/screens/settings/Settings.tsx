import * as React from 'react';
import { ScrollView, Switch, Platform, ActionSheetIOS } from 'react-native';
import { observer } from 'mobx-react';
import CellGroup from 'components/cell/CellGroup';
import Cell from 'components/cell/Cell';
import { Options } from 'types/Options';
import { Store } from 'store';
import { Languages, Browsers } from 'store/models/Settings';
const styles = require('./Settings.css');

interface IProps {
  componentId: string;
  imageUrl: string;
}

const switchConfig = {
  onTintColor: '#ff2244',
  trackColor: '#ff2244',
};

@observer
export default class Settings extends React.Component<IProps> {

  static get options() {
    return {
      topBar: {
        title: {
          text: 'Settings',
          color: '#FFFFFF',
        },
        background: {
          color: '#000000',
        },
        buttonColor: '#FF2244',
      },
      bottomTab: {
        testID: 'SETTINGS_TAB',
        text: 'Settings',
        iconColor: '#FFFFFF',
        textColor: '#FFFFFF',
        selectedTextColor: '#FF2244',
        selectedIconColor: '#FF2244',
        icon: require('../../assets/icons/adjust.png'),
        selectedIcon: require('../../assets/icons/adjust-filled.png'),
      },
      layout: {
        backgroundColor: '#000000',
      },
      bottomTabs: {
        translucent: false,
        barStyle: 'black',
        drawBehind: true,
        backgroundColor: '#000000',
      },
    } as Options;
  }

  onLanguagePress() {
    const options = [...Object.values(Languages), 'Cancel'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      },
      (index: number) => {
        if (index < options.length) {
          Store.settings.setLanguage(Object.keys(Languages)[index]);
        }
      },
    );
  }

  onBrowserPress() {
    const options = [...Object.values(Browsers), 'Cancel'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      },
      (index: number) => {
        if (index < options.length) {
          Store.settings.setBrowser(Object.keys(Browsers)[index]);
        }
      },
    );
  }

  render() {
    return (
      <ScrollView style={styles.host}>
        <CellGroup header="General">
          <Cell
            title="Language"
            value={Store.settings.languageDisplay}
            onPress={this.onLanguagePress}
          />
          <Cell
            title="Hide Synopsis"
            value={(
              <Switch
                value={Store.settings.hideSynopsis}
                onValueChange={Store.settings.setHideSynopsis}
                {...switchConfig}
              />
            )}
          />
        </CellGroup>
        <CellGroup header="Appearance">
          <Cell
            title="Hide Bars On Scroll"
            value={(
              <Switch
                value={Store.settings.hideDaysOnScroll}
                onValueChange={Store.settings.setHideDaysOnScroll}
                {...switchConfig}
              />
            )}
          />
          <Cell
            title="Enable Poster Animations"
            value={(
              <Switch
                value={Store.settings.posterAnimation}
                onValueChange={Store.settings.setPosterAnimation}
                {...switchConfig}
              />
            )}
          />
        </CellGroup>
        <CellGroup header="Browser">
          {Platform.OS === 'ios' && (
            <Cell
              title="Always Use Reader Mode"
              value={<Switch
                value={Store.settings.useReaderMode}
                onValueChange={Store.settings.setUseReaderMode}
                {...switchConfig}
              />}
            />
          )}
          <Cell
            title="Open Links In"
            value={Store.settings.browserDisplay}
            onPress={this.onBrowserPress}
          />
        </CellGroup>
      </ScrollView>
    );
  }
}
