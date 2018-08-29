import * as React from 'react';
import { View, Text } from 'react-native';
const styles = require('./Section.css');

interface IProps {
  title: string;
  children: React.ReactNode;
}

export default class Section extends React.PureComponent<IProps, {}> {
  render() {
    const { title, children } = this.props;

    return (
      <View style={styles.host}>
        <Text style={styles.title}>{title}</Text>
        {children}
      </View>
    );
  }
}
