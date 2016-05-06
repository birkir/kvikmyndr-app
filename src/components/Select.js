import React, {
  Component,
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  PropTypes,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

export default class Select extends Component {

  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    navigator: PropTypes.object,
  }

  constructor(...args) {
    super(...args);

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    // push new route to navigator
  }

  render() {
    const { label, value } = this.props;

    return (
      <TouchableHighlight
        onPress={this.onPress}
        underlayColor="#e5e5e5"
        style={s.touch}
      >
        <View style={s.row}>
          <Text style={s.label}>{label}</Text>
          <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
            <Text style={s.value}>{value}</Text>
            <Icon name="chevron-thin-right" size={13} color="#c7c7c7" style={s.chevron} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

/**
 * @const {StyleSheet} Component styles
 */
const s = StyleSheet.create({

  touch: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#c8c7cc',
    paddingLeft: 12,
    paddingRight: 12,
  },

  row: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
  },

  label: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    paddingLeft: 10,
  },

  chevron: {
    top: -2,
    marginLeft: 4,
  },

  value: {
    fontSize: 15,
    color: '#c7c7c7',
  },

});
