import React, { PropTypes } from 'react';
import { TouchableHighlight, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const Item = ({ children, icon, label, value, onPress, isBold }) => (
  <TouchableHighlight onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
    <View style={s.host}>
      {icon && <Icon name={icon} size={17} color="#fff" style={s.icon} />}
      <Text style={[s.label, isBold && s.label__bold]}>
        {label}
      </Text>
      {children}
      {!children && value && (
        <Text style={s.value}>
          {value}
        </Text>
      )}
    </View>
  </TouchableHighlight>
);

Item.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  isBold: PropTypes.bool,
  onPress: PropTypes.func,
};

Item.defaultProps = {
  children: undefined,
  icon: undefined,
  label: undefined,
  value: undefined,
  isBold: false,
  onPress: undefined,
};

const s = StyleSheet.create({
  host: {
    backgroundColor: '#1c1c1c',
    borderBottomColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderTopColor: '#262626',
    borderTopWidth: 1,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  icon: {
    marginTop: 2,
    marginRight: 15,
  },

  label: {
    fontSize: 15,
    fontWeight: '300',
    color: '#fff',
    flex: 1,
  },

  label__bold: {
    fontWeight: '600',
  },

  value: {
    fontSize: 12,
    color: '#777',
  },
});


export default Item;
