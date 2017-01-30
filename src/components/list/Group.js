import React, { PropTypes } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Group = ({ label, children }) => (
  <View style={s.host}>
    {label && (<Text style={s.label}>{label}</Text>)}
    <View style={s.container}>
      {children}
    </View>
  </View>
);

Group.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
};

Group.defaultProps = {
  label: undefined,
  children: undefined,
};

const s = StyleSheet.create({
  host: {
  },
  label: {
    fontSize: 10,
    color: '#777',
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  container: {
    borderBottomColor: '#262626',
    borderBottomWidth: 1,
  },
});


export default Group;
