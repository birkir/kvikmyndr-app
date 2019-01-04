import * as React from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, TextStyle } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { autobind } from 'core-decorators';
import Store from 'store';
const styles = require('./TextMore.css');

interface IProps {
  testID?: string;
  expanded?: boolean;
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
}

@observer
export default class TextMore extends React.Component<IProps, {}> {

  static defaultProps = {
    numberOfLines: 2,
    expanded: false,
  } as IProps;

  private heights: {
    collapsed?: number;
    expanded?: number;
  } = {};

  @observable
  expanded: boolean = this.props.expanded || false;

  @observable
  calculated: boolean = false;

  @observable
  hasEqualOrLessLines: boolean = false;

  componentWillReceiveProps({ expanded, numberOfLines, style }: Readonly<IProps>) {
    if (expanded !== undefined) {
      this.expanded = expanded;
    }
    if (numberOfLines !== this.props.numberOfLines || style !== this.props.style) {
      // Recalculate styles
      this.calculated = false;
      this.heights = {};
    }
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  @autobind
  onPressMore() {
    this.expanded = !this.expanded;
  }

  @autobind
  onLayout(e: any) {
    this.calculateHeight({
      collapsed: e.nativeEvent.layout.height,
    });
  }

  @autobind
  onLayoutCalc(e: any) {
    this.calculateHeight({
      expanded: e.nativeEvent.layout.height,
    });
  }

  @autobind
  calculateHeight({ collapsed, expanded }: { collapsed?: number; expanded?: number; }) {
    if (collapsed !== undefined) {
      this.heights.collapsed = collapsed;
    }

    if (expanded !== undefined) {
      this.heights.expanded = expanded;
    }

    if (this.heights.collapsed && this.heights.expanded) {
      this.calculated = true;
      this.hasEqualOrLessLines = this.heights.collapsed >= this.heights.expanded;
    }
  }

  render() {
    const {
      children,
      numberOfLines,
      style,
      testID,
    } = this.props;

    return (
      <View style={styles.host} testID={testID}>
        {!this.calculated && (
          <Text style={[styles.calculate, style]} onLayout={this.onLayoutCalc}>{children}</Text>
        )}
        {!this.expanded && (
          <Text style={style} numberOfLines={numberOfLines} onLayout={this.onLayout}>
            {children}
          </Text>
        )}
        {this.expanded && <Text style={style}>
          {children}
        </Text>}
        {!this.hasEqualOrLessLines && <TouchableOpacity onPress={this.onPressMore}>
          <Text style={styles.button}>read {!this.expanded ? Store.settings.locale.MORE : Store.settings.locale.LESS}</Text>
        </TouchableOpacity>}
      </View>
    );
  }
}
