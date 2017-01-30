import React, { Component, PropTypes } from 'react';
import { ActivityIndicator, View, Text, ListView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react/native';
import { autobind } from 'core-decorators';
import Icon from 'react-native-vector-icons/Entypo';
import MovieItem from 'components/movie-item';
import store from 'store';

const ds = new ListView.DataSource({
  rowHasChanged: (a, b) => (a !== b),
});

/**
 * List of movies in theaters now
 */
@observer
export default class MovieList extends Component {

  static propTypes = {
    items: PropTypes.array, // eslint-disable-line
    selectedDate: PropTypes.object, // eslint-disable-line
  };

  static defaultProps = {
    items: null,
    selectedDate: undefined,
  };

  @autobind
  renderRow(item) {
    return (
      <MovieItem
        movie={item}
        selectedDate={this.props.selectedDate}
      />
    );
  }

  /**
   * Main component render method
   * @return {Component}
   */
  render() {
    const { items } = this.props;

    if (!items) {
      return (
        <View style={s.loading}>
          <ActivityIndicator
            animating
            color="#fff"
            style={s.loading__indicator}
            size="large"
          />
          <Text style={s.loading__text}>{store.UI.i18n.LOADING_DATA}</Text>
        </View>
      );
    }

    if (items.length === 0) {
      return (
        <View style={s.nothing}>
          <Icon name="emoji-sad" size={64} color="#fff" />
          <Text style={s.nothingText}>{store.UI.i18n.NO_RESULTS}</Text>
        </View>
      );
    }

    return (
      <ListView
        contentContainerStyle={s.list}
        renderRow={this.renderRow}
        dataSource={ds.cloneWithRows(items)}
      />
    );
  }
}

const s = StyleSheet.create({

  list: {
    marginVertical: 10,
    marginHorizontal: 8.25,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loading__indicator: {
    height: 75,
    marginTop: 20,
  },

  loading__text: {
    fontSize: 20,
    color: '#aaa',
  },

  nothing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nothingText: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
  },
});
