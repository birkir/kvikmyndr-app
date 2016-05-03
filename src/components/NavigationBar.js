import React, {
  Component,
  View,
  Text,
  StyleSheet,
  PropTypes,
} from 'react-native';
let s = {};

/**
 * Navigation Bar component
 */
export default class NavigationBar extends Component {

  /**
   * PropTypes
   * @return {object}
   */
  static propTypes = {
    title: PropTypes.string,
  };

  /**
   * Render method
   * @return {Component}
   */
  render() {
    // Extract properties
    const { title } = this.props;

    return (
      <View style={s.host}>
        <Text>{title}</Text>
      </View>
    );
  }
}

/**
 * @const {StyleSheet} Component styles
 */
s = StyleSheet.create({
  host: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: 50,
    marginTop: 24,

    backgroundColor: '#000',
  },

  title: {
    fontSize: 21,
    fontWeight: '400',
    color: '#fff',
  },
});
