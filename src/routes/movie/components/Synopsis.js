/* global requestAnimationFrame */
import React, { Component, PropTypes } from 'react';
import { Animated, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Entypo';
import { autobind } from 'core-decorators';

const LINES = 3;

@observer
export default class Synopsis extends Component {

  static propTypes = {
    text: PropTypes.string,
  };

  static defaultProps = {
    text: '',
  };

  /**
   * Fired when synopsis is pressed
   * @return {void}
   */
  @autobind
  onPress() {
    // Check if expandible
    if (this.isExpandable) {
      // Toggle expanded flag
      this.isExpanded = !this.isExpanded;
      // Toggle animation value as 0-1 value
      Animated.timing(this.animation, {
        toValue: Number(this.isExpanded),
        duration: 330,
      }).start();
    }
  }

  /**
   * Fired when ref is going to be set.
   * @return {void}
   */
  @autobind
  onTextRef(ref) {
    // Check if ref to node is available
    if (ref) {
      // Wait untill rendered and measure height
      requestAnimationFrame(() => ref.measure((x, y, w, h) => {
        // Set the text height observable var
        this.textHeight = h;
      }));
    }
  }

  /**
   * @var Value used for animating
   */
  animation = new Animated.Value(0);

  /**
   * @var {bool} Flag if expanded or not
   */
  @observable
  isExpanded = false;

  /**
   * @var {Number} Text height in pixels
   */
  @observable
  textHeight = 0;

  /**
   * Check if height is more than default number of lines.
   */
  @computed
  get isExpandable() {
    return (this.textHeight > (LINES * 23));
  }

  render() {

    // Extract properties
    const {
      animation,
      onPress,
      isExpandable,
      textHeight,
      onTextRef,
    } = this;

    // Setup interpolated animation value
    const height = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [LINES * 22, textHeight],
    });

    // Setup interpolated rotate transformation value
    const transform = [{
      rotate: animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      }),
    }];

    if (this.props.text.trim() === '') {
      return null;
    }

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Animated.View style={[s.host, { height }]}>
          <Text style={s.synopsis} ref={onTextRef}>
            {this.props.text}
          </Text>
          {isExpandable && (
            <Animated.View style={[s.more, { transform }]} >
              <Icon name="triangle-down" size={12} color="#fff" />
            </Animated.View>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const s = StyleSheet.create({

  host: {
    overflow: 'hidden',
  },

  synopsis: {
    paddingHorizontal: 30,
    position: 'absolute',
    fontSize: 17,
    lineHeight: 22,
    color: '#aaa',
    flex: 1,
  },

  more: {
    backgroundColor: '#000',
    width: 20,
    height: 20,
    position: 'absolute',
    bottom: -5,
    right: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
