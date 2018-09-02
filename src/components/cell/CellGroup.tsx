import * as React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { observer } from 'mobx-react';
const styles = require('./CellGroup.css');

interface IProps {
  key?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  testID?: string;
}

@observer
export default class CellGroup extends React.Component<IProps, any> {

  renderHeader() {
    const { header } = this.props;

    if (!header) return null;

    if (typeof header === 'boolean' && header === true) {
      return <View style={[styles.header, styles.header__empty]} />;
    }

    if (typeof header === 'object' && React.isValidElement(header)) {
      return header;
    }

    return (
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.header__text}>{String(header).toUpperCase()}</Text>
        </View>
      </SafeAreaView>
    );
  }

  renderItem(item: any, index: number) {
    if (React.isValidElement(item) === false) {
      return null;
    }

    return React.cloneElement(item, { ...item.props, index });
  }

  renderFooter() {
    const { footer = true } = this.props;
    if (!footer) return null;

    if (typeof footer === 'boolean' && footer === true) {
      return <View style={[styles.footer, styles.footer__empty]} />;
    }

    if (typeof footer === 'object' && React.isValidElement(footer)) {
      return footer;
    }

    return (
      <View style={styles.footer}>
        <Text style={styles.footer__text}>{String(footer)}</Text>
      </View>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <View style={styles.host}>
        {this.renderHeader()}
        <View style={styles.items}>
          {React.Children.map(children, this.renderItem)}
        </View>
        {this.renderFooter()}
      </View>
    );
  }
}
