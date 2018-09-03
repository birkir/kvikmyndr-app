import * as React from 'react';
import { View, StatusBar, Platform, ActionSheetIOS } from 'react-native';
import { observer, Observer } from 'mobx-react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Navigation } from 'react-native-navigation';
import { Options } from 'types/Options';
import { autobind } from 'core-decorators';
import { getInsets } from 'utils/getConstants';
import { InTheaters } from 'store/in-theaters';
import { IMovie } from 'store/models/Movie';
import { pushMovieScreen } from 'screens';
import MovieItem from 'components/movie-item/MovieItem';
import WeekTabView from 'components/week-tab-view/WeekTabView';
import Store from 'store';
import CodePush from 'react-native-code-push';
import codePushConfig from 'utils/codePushConfig';
import { openActionSheet } from 'utils/openActionSheet';
import { SortBys } from 'store/models/Settings';
const styles = require('./Week.css');

interface IProps {
  componentId: string;
  testID?: string;
}

@CodePush(codePushConfig())
@observer
class Week extends React.Component<IProps> {

  static get options() {
    return {
      topBar: {
        title: {
          text: 'In Theaters',
          color: '#FFFFFF',
        },
        drawBehind: true,
        ...Platform.select({
          android: {
            background: {
              color: 'rgba(0, 0, 0, 0)',
            },
          },
          ios: {
            translucent: true,
            transparent: true,
          },
        }),
        buttonColor: '#FF2244',
        leftButtons: Platform.select({
          android: [{
            id: 'ICON_MENU',
            icon: require('../../assets/icons/menu.png'),
            text: 'Menu',
            color: '#FFFFFF',
          }],
          ios: [],
        }),
        rightButtons: [{
          id: 'ICON_FILTER',
          icon: require('../../assets/icons/ascending-sorting.png'),
          text: 'Filter',
          color: '#FFFFFF',
        }],
      },
      bottomTab: {
        testID: 'WEEK_TAB',
        text: 'In Theaters',
        iconColor: '#FFFFFF',
        textColor: '#FFFFFF',
        selectedTextColor: '#FF2244',
        selectedIconColor: '#FF2244',
        icon: require('../../assets/icons/movie.png'),
        selectedIcon: require('../../assets/icons/movie-filled.png'),
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

  events = Navigation.events().bindComponent(this);

  state = {
    insets: { top: 0, bottom: 0, calculated: false },
  };

  componentDidMount() {
    InTheaters.loadWeek();

    getInsets(this.props.componentId)
      .then((insets) => {
        this.setState({ insets });
        Store.setInsets(insets);
      });
  }

  componentDidAppear() {
    Store.setComponentId(this.props.componentId);
  }

  componentWillUnmount() {
    this.events.remove();
  }

  @autobind
  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'ICON_FILTER') {
      this.onFilterSelect(null, 0);
    }
    if (buttonId === 'ICON_MENU') {
      Navigation.mergeOptions(Store.menuComponentId, {
        sideMenu: {
          left: {
            visible: true,
          },
        },
      });
    }
  }

  onFilterPress() {
    openActionSheet({
      options: ['Sort By', 'Filter By'],
      cancel: true,
      onSelect: this.onFilterSelect,
    });
  }

  @autobind
  onFilterSelect(option: any, index: number) {
    if (index === 0) {
      openActionSheet({
        options: Object.entries(SortBys),
        type: 'radio',
        selectedId: Store.settings.weekSortBy,
        cancel: true,
        onSelect: this.onSortBySelect,
      });
    }
  }

  @autobind
  onSortBySelect(option: any, index: number) {
    Store.settings.setWeekSortBy(option[0]);
  }

  @autobind
  onMoviePress(
    { movie, elementId, selectedTab }:
    { movie: IMovie, elementId: string, selectedTab?: number; },
  ) {
    const { componentId } = this.props;
    return pushMovieScreen({
      componentId,
      elementId,
      selectedTab,
      movieId: movie.id,
    });
  }

  @autobind
  renderTab(route: { key: string; date: Date; }) {
    const { date, key } = route;
    const s = (a: any, b: any) => {

      if (Store.settings.weekSortBy === 'title') {
        return a.movie.title!.localeCompare(b.movie.title!);
      }

      if (Store.settings.weekSortBy === 'rating') {
        return b.movie.imdbRating! - a.movie.imdbRating!;
      }

      return b.movie.showtimes!.length - a.movie.showtimes!.length;
    };

    return (
      <Observer>
        {() => InTheaters.moviesForDate(date).sort(s).map((item: any, i: number) => (
          <MovieItem
            elementId={`${key}_${item.movie.id}`}
            key={i}
            movie={item.movie}
            selectedTab={Number(key)}
            onPress={this.onMoviePress}
          />
        ))}
      </Observer>
    );
  }

  render() {
    const { insets } = this.state;

    if (!insets.calculated) {
      return null;
    }

    return (
      <View style={styles.host} testID="WEEK_SCREEN">
        <StatusBar barStyle="light-content" />
        <WeekTabView
          insets={insets}
          render={this.renderTab}
          hideTabsOnScroll={Store.settings.hideDaysOnScroll}
        />
      </View>
    );
  }
}

export default gestureHandlerRootHOC(Week);
