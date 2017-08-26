import React, { Component } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { autobind } from 'core-decorators';

@observer
export default class CollapsedText extends Component {

  static propTypes = {
    children: PropTypes.node,
    numberOfLines: PropTypes.number,
    style: PropTypes.any,
  }

  static defaultProps = {
    children: undefined,
    numberOfLines: 2,
    style: undefined,
  }

  componentWillReceiveProps({ numberOfLines }) {
    if (numberOfLines !== this.props.numberOfLines) {
      this.expandedHeight = undefined;
      this.collapsedHeight = undefined;
    }
  }

  @autobind
  onLayoutExpanded(e) {
    if (!this.expandedHeight) {
      this.expandedHeight = e.nativeEvent.layout.height;
    }
  }

  @autobind
  onLayoutCollapsed(e) {
    if (!this.collapsedHeight) {
      this.height.setValue(e.nativeEvent.layout.height);
      this.collapsedHeight = e.nativeEvent.layout.height;
    }
  }

  @autobind
  onPress() {
    this.isCollapsedView = !this.isCollapsedView;
    if (!this.isCollapsedView) {
      this.isCollapsedText = false;
    }
    Animated.spring(this.height, {
      toValue: this.isCollapsedView ? this.collapsedHeight : this.expandedHeight,
    }).start(() => {
      this.isCollapsedText = this.isCollapsedView;
    });
  }

  @observable
  isCollapsedView = true;

  @observable
  isCollapsedText = true;

  @observable
  expandedHeight = undefined;

  @observable
  collapsedHeight = undefined;

  height = new Animated.Value(0);

  render() {
    const { expandedHeight, collapsedHeight, isCollapsedView, isCollapsedText } = this;
    const { children, numberOfLines, style } = this.props;

    if (!expandedHeight) {
      return (
        <View onLayout={this.onLayoutExpanded}>
          <Text style={style}>{children}</Text>
        </View>
      );
    }

    const container = {
      overflow: 'hidden',
      marginBottom: 2,
    };

    if (collapsedHeight) {
      container.height = this.height;
    }

    return (
      <View style={styles.host}>
        <Animated.View style={container} onLayout={this.onLayoutCollapsed}>
          <Text style={style} numberOfLines={isCollapsedText ? numberOfLines : undefined}>
            {children}
          </Text>
        </Animated.View>
        {(expandedHeight !== collapsedHeight) && (
          <TouchableOpacity onPress={this.onPress}>
            <Text style={styles.button}>read {isCollapsedView ? 'more' : 'less'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flexDirection: 'column',
  },
  button: {
    marginTop: 2,
    fontSize: 13,
    color: '#777',
  },
});
