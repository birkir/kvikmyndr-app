/* eslint react/no-array-index-key: 0 */
import React, { Component } from 'react';
import { SegmentedControlIOS, Button, Animated, View, Text, Slider, StyleSheet } from 'react-native';
import { reaction, observable, autorun } from 'mobx';
import { Actions } from 'react-native-mobx';
import { observer } from 'mobx-react/native';
import { autobind, throttle } from 'core-decorators';
import { Item } from 'components/list';
import store from 'store';

const HEIGHT = 200;

@observer
export default class FilterSheet extends Component {

  componentDidMount() {
    this.setup();
  }

  @autobind
  @throttle(500)
  onOrderByChange(val) {
    const { orderBy } = store.UI;
    const index = Object.values(orderBy).findIndex(m => m === val);
    store.UI.filter.orderBy = Object.keys(orderBy)[index];
  }

  @autobind
  onRatingSliderValueChange(value) {
    this.rating = value;
  }

  onClosePress() {
    store.UI.isInTheatersFilterSheetOpen = false;
  }

  setup() {
    autorun(() => {
      const toValue = store.UI.isInTheatersFilterSheetOpen ? 0 : -HEIGHT;
      Animated.timing(this.bottom, { toValue }).start();
    });

    reaction(
      () => (this.rating * 10),
      rating => (store.UI.filter.rating = rating),
      { delay: 250 },
    );
  }

  @observable
  rating = store.UI.filter.rating;

  @observable
  bottom = new Animated.Value(-HEIGHT);

  /**
   * Render method
   * @return {Component}
   */
  render() {
    const pointerEvents = store.UI.isInTheatersFilterSheetOpen ? 'auto' : 'box-none';
    const orderBy = Object.entries(store.UI.orderBy);
    const filterOrderBy = store.UI.filter.orderBy;

    return (
      <View style={s.host} pointerEvents={pointerEvents}>
        <Animated.View style={[s.card, { bottom: this.bottom }]}>
          <View style={s.card__inner}>
            <Item label={store.UI.i18n.ORDER_BY}>
              <SegmentedControlIOS
                values={orderBy.map(m => store.UI.i18n[m[1]])}
                selectedIndex={orderBy.findIndex(m => m[0] === filterOrderBy)}
                onValueChange={this.onOrderByChange}
                tintColor="#fff"
                style={s.orderByTabs}
              />
            </Item>
            <Item label="Theaters" value={store.UI.labelTheaters} onPress={Actions.SETTINGS_THEATERS} />
            <Item label={store.UI.i18n.IMDB_RATING}>
              <Slider
                value={this.rating}
                onValueChange={this.onRatingSliderValueChange}
                minimumTrackTintColor="#777"
                maximumTrackTintColor="#E80054"
                style={s.ratingSlider}
              />
              <Text style={s.ratingLabel}>
                {(this.rating < 0.01)
                  ? store.UI.i18n.ALL
                  : (Math.floor(this.rating * 100) / 10).toFixed(1)
                }
              </Text>
            </Item>
            <View style={s.button}>
              <Button
                title={store.UI.i18n.CLOSE}
                color="#E80054"
                onPress={this.onClosePress}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  host: {
    position: 'absolute',
    height: HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(64, 64, 64, 0.6)',
  },

  ratingLabel: {
    color: '#fff',
    width: 40,
    textAlign: 'right',
  },

  ratingSlider: {
    width: 150,
  },

  orderByTabs: {
    width: 200,
  },

  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HEIGHT,
    backgroundColor: '#1c1c1c',
  },

  card__inner: {
    height: HEIGHT,
    padding: 0,
  },

  button: {
    borderTopColor: '#262626',
    borderTopWidth: 1,
    paddingTop: 3,
  },
});
