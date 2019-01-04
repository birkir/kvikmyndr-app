import * as React from 'react';
import { View, Text, SectionList, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { Store } from 'store';
import { Movies } from 'store/movies';
import { IMovie } from 'store/models/Movie';
import { autobind } from 'core-decorators';
import { groupBy } from 'lodash';
import { addDays, isSameDay, format } from 'date-fns';
import MovieItem from 'components/movie-item/MovieItem';
import { Options } from 'types/Options';
import { pushMovieScreen } from 'screens';
import { getInsets } from 'utils/getConstants';
import { Navigation } from 'react-native-navigation';
const styles = require('./ComingSoon.css');

interface IProps {
  componentId: string;
}

@observer
export default class ComingSoon extends React.Component<IProps> {

  static get options() {
    return {
      topBar: {
        title: {
          text: Store.settings.locale.COMING_SOON,
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
        leftButtons: Platform.select({
          android: [{
            id: 'ICON_MENU',
            icon: require('../../assets/icons/menu.png'),
            text: 'Menu',
            color: '#FFFFFF',
          }],
          ios: [],
        }),
        buttonColor: '#FF2244',
      },
      bottomTab: {
        testID: 'COMING_SOON_TAB',
        text: Store.settings.locale.COMING_SOON,
        iconColor: '#FFFFFF',
        textColor: '#FFFFFF',
        selectedTextColor: '#FF2244',
        selectedIconColor: '#FF2244',
        icon: require('../../assets/icons/calendar.png'),
        selectedIcon: require('../../assets/icons/calendar-filled.png'),
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
    Movies.loadNewMovies();

    getInsets(this.props.componentId)
      .then(insets => this.setState({ insets }));
  }

  componentDidAppear() {
    Store.setComponentId(this.props.componentId);
  }

  componentWillUnmount() {
    this.events.remove();
  }

  @autobind
  navigationButtonPressed({ buttonId }: { buttonId: string }) {
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

  @autobind
  onMoviePress({ movie, elementId }: { movie: IMovie, elementId: string; }) {
    const { componentId } = this.props;
    return pushMovieScreen({
      componentId,
      elementId,
      movieId: movie.id,
    });
    return null;
  }

  sortByTime(a: IMovie, b: IMovie) {
    return new Date(a.releaseDate || '') < new Date(b.releaseDate || '') ? -1 : 1;
  }

  @autobind
  renderMovieItem({ item: movie }: { item: IMovie }) {
    return (
      <View key={movie.id}>
        <MovieItem
          elementId={`coming_soon_${movie.id}`}
          movie={movie}
          onPress={this.onMoviePress}
        />
      </View>
    );
  }

  @autobind
  renderSectionHeader({ section }: any) {
    const date = new Date(`${section.title} 00:00:00.000Z`);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    let title = format(date, 'PPP', { locale: Store.settings.dateLocale })
      .replace(String((new Date()).getFullYear()), '')
      .trim()
      .replace(/\,$/, '');

    if (isSameDay(date, today)) title = 'Today';
    if (isSameDay(date, tomorrow)) title = 'Tomorrow';
    return (
      <View style={styles.section}>
        <Text style={styles.section__title}>{title}</Text>
      </View>
    );
  }

  render() {
    const { top, bottom } = this.state.insets;
    const moviesByDate = groupBy(Movies.comingSoon.sort(this.sortByTime), (movie: IMovie) =>
      (new Date(movie.releaseDate!)).toDateString());

    return (
      <SectionList
        style={[styles.host, { marginTop: top }]}
        sections={Object.entries(moviesByDate).map(([title, data]) => ({ title, data }))}
        keyExtractor={movie => movie.id}
        renderItem={this.renderMovieItem}
        renderSectionHeader={this.renderSectionHeader}
        contentContainerStyle={[styles.content, { paddingBottom: bottom }]}
      />
    );
  }
}
