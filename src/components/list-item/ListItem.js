import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image,
} from 'react-native';
import { computed } from 'mobx';
import PropTypes from 'prop-types';

export default class ListItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    value: PropTypes.string,
    icon: PropTypes.string,
    styles: PropTypes.object,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    title: undefined,
    subtitle: undefined,
    value: undefined,
    icon: undefined,
    styles: {},
    onPress: undefined,
  };

  @computed
  get icon() {
    const { icon } = this.props;
    if (icon === 'checkmark') {
      return require('../../images/icons/checkmark.png');
    }
    return null;
  }

  render() {
    const {
      title,
      subtitle,
      icon,
      value,
      onPress,
      styles: userStyles,
    } = this.props;

    const isTitle = !!title || !!subtitle;

    return (
      <View>
        <TouchableHighlight
          underlayColor="#141414"
          onPress={onPress}
          disabled={!onPress}
        >
          <View style={[styles.host, userStyles.host]}>
            <View style={styles.row}>
              {isTitle && (
                <View style={styles.content}>
                  {title && (
                    <Text style={[styles.title, userStyles.title]}>{title}</Text>
                  )}
                  {subtitle && (
                    <Text style={[styles.subtitle, userStyles.subtitle]}>
                      {subtitle}
                    </Text>
                  )}
                </View>
              )}
              {icon && (
                <View style={styles.center}>
                  <Image source={this.icon} style={[styles.icon, userStyles.icon]} />
                </View>
              )}
              {value && (
                <View style={styles.center}>
                  <Text style={[styles.value, userStyles.value]}>{value}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.divider} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    padding: 16,
    paddingLeft: 0,
    backgroundColor: 'transparent',
  },

  divider: {
    height: 1,
    backgroundColor: '#323232',
    marginLeft: 16,
  },

  row: {
    flexDirection: 'row',
    marginLeft: 15,
  },

  content: {
    flexDirection: 'column',
    flex: 1,
  },

  icon: {
    tintColor: '#FFFFFF',
  },

  title: {
    fontSize: 17,
    color: '#FFFFFF',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 2,
    color: '#86939E',
  },

  center: {
    justifyContent: 'center',
  },

  value: {
    fontSize: 17,
    color: '#8F8E94',
  },
});
