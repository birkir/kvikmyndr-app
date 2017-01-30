import React, { Component, PropTypes } from 'react';
import { View, Text, Linking, TouchableHighlight, StyleSheet } from 'react-native';
import { computed } from 'mobx';
import { autobind } from 'core-decorators';
import store from 'store';

export default class Showtime extends Component {

  static propTypes = {
    hall: PropTypes.string,
    hour: PropTypes.string,
    ticketUrl: PropTypes.string,
    flags: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.any, // eslint-disable-line
  };

  static defaultProps = {
    hall: undefined,
    hour: undefined,
    ticketUrl: undefined,
    flags: [],
    date: undefined,
  };

  @autobind
  onPress() {
    Linking.openURL(this.ticketUrl);
  }

  @computed
  get ticketUrl() {
    const { ticketUrl } = this.props;
    if (ticketUrl.match(/sambio\.is/)) {
      return ticketUrl.replace(/sambio\.is\//, 'sambio.is/mobile/');
    }
    return ticketUrl;
  }

  @computed
  get missed() {
    return this.props.date.isBefore(store.UI.date);
  }

  render() {
    const hallStyles = [s.hall];
    const { hour, flags } = this.props;
    const style = { flex: 1 };
    let hall = this.props.hall;

    // Show blank space for no-show
    if (!hour) {
      return <View style={s.blank} />;
    }

    if (this.missed) {
      style.opacity = 0.5;
    }

    let flag;

    flags.concat(hall).forEach((str) => {
      if (str.match(/LÚX|LUX|lux|VIP|vip/)) {
        hall = 'VIP';
        hallStyles.push(s.hall__vip);
      }
      const tal = str.match(/(.*?) (tal|TAL)/);
      if (tal) {
        flag = tal[1].replace('ÍSL', 'IS');
      }
    });

    return (
      <TouchableHighlight onPress={this.onPress} style={style}>
        <View style={s.host}>
          <View style={s.container}>
            <Text style={s.hour}>{hour}</Text>
            {!!flag && <Text key={flag} style={s.flag}>{flag}</Text>}
          </View>
          {!!hall && <Text style={hallStyles}>{hall}</Text>}
        </View>
      </TouchableHighlight>
    );
  }
}

const s = StyleSheet.create({
  host: {
    marginRight: 5,
    height: 50,
    flex: 1,
    paddingTop: 8,
    marginBottom: 8,
  },

  container: {
    flex: 1,
    backgroundColor: '#212121',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  blank: {
    flex: 1,
    marginRight: 5,
    backgroundColor: 'transparent',
  },

  hour: {
    fontSize: 17,
    fontWeight: '500',
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },

  hall: {
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: 9,
    position: 'absolute',
    top: 0,
    left: 0,
    paddingVertical: 1,
    paddingHorizontal: 5,
    backgroundColor: '#555',
    borderRadius: 1,
  },

  hall__vip: {
    fontWeight: '800',
    fontStyle: 'normal',
    backgroundColor: 'orange',
  },

  flag: {
    marginTop: 2,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#aaa',
  },

  missed: {
    opacity: 0.5,
  },
});
