import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { observer } from 'mobx-react/native';
import { computed, observable } from 'mobx';
import MovieList from 'components/movie-list';
import FilterSheet from 'routes/in-theaters/components/FilterSheet';
import moment from 'moment';
import store from 'store';

@observer
export default class InTheaters extends Component {

  componentDidMount() {
    this.unsubscribe = store.movies.subscribeInTheaters(5);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChangeTab(i) {
    this.selectedDate = moment(store.UI.dateYmd).add(i, 'days');
  }

  @observable
  selectedDate = moment(store.UI.dateYmd);

  @computed
  get days() {
    return [0, 1, 2, 3, 4].map(n => moment(store.UI.dateYmd).add(n, 'days'));
  }

  @computed
  get tabBarPage() {
    const today = moment(store.UI.dateYmd);
    const wanted = moment(this.selectedDate);
    const page = wanted.diff(today, 'days') || 0;
    return Math.max(0, page);
  }

  /**
   * Render default shipped tabBar
   */
  renderTabBar() {
    return (
      <DefaultTabBar
        underlineColor="#E80054"
        backgroundColor="#000"
        activeTextColor="#E80054"
        inactiveTextColor="#fff"
        underlineStyle={{ height: 2, backgroundColor: '#e80054' }}
        textStyle={s.tabBarText}
        style={s.tabBar}
      />
    );
  }

  render() {
    return (
      <View style={s.host}>
        <ScrollableTabView
          ref={c => c && c.goToPage(this.tabBarPage)}
          renderTabBar={this.renderTabBar}
          prerenderingSiblingsNumber={5}
          onChangeTab={this.onChangeTab}
        >
          {this.days.map((date, i) => (
            <View
              key={date.format('d')}
              style={s.list}
              tabLabel={date.format('ddd')}
            >
              <MovieList
                items={store.movies.getInTheatersByDay(i)}
                selectedDate={date}
              />
            </View>
          ))}
        </ScrollableTabView>
        <FilterSheet />
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 64,
  },

  tabBar: {
    borderBottomWidth: 0,
  },

  tabBarText: {
    fontSize: 18,
    fontWeight: '300',
  },

  list: {
    flex: 1,
    backgroundColor: '#000',
  },
});
