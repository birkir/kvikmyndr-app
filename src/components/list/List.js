import React, { PropTypes } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

const List = ({ children }) => (
  <ScrollView style={s.host}>
    {children}
  </ScrollView>
);

List.propTypes = {
  children: PropTypes.node,
};

List.defaultProps = {
  children: undefined,
};

const s = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: '#171717',
  },
});

export default List;
