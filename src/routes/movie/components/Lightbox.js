import React, { Component, PropTypes } from 'react';
import { Modal, Dimensions, Animated, View, TouchableWithoutFeedback } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { autobind } from 'core-decorators';

// Shorthand animate function
const animate = (prop, toValue) => Animated.timing(prop, { toValue, duration: 180 });

@observer
export default class Lightbox extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: undefined,
  };

  @autobind
  onRequestClose() {
    return this.onPress();
  }

  @autobind
  onPress() {
    // Pause all current animations
    this.position.stopAnimation();
    this.width.stopAnimation();
    this.height.stopAnimation();

    // Measure host x, y, width and height
    this.host.measureInWindow((x, y, w, h) => {
      if (this.isActive) {
        // Animate to original position and size
        Animated.parallel([
          animate(this.position, { x, y }),
          animate(this.width, w),
          animate(this.height, h),
        ])
        // Then set active flag
        .start(() => (this.isActive = false));
      } else {
        // Start by setting active flag
        this.isActive = true;

        // Show overlay in host position (ghost mode)
        this.position.setValue({ x, y });
        this.width.setValue(w);
        this.height.setValue(h);

        // Get window width and height
        const { height, width } = Dimensions.get('window');

        // Animate to fullscreen
        Animated.parallel([
          animate(this.position, { x: 0, y: 0 }),
          animate(this.width, width),
          animate(this.height, height),
        ]).start();
      }
    });
  }

  /**
   * @var {bool} Flag if is active
   */
  @observable
  isActive = false;

  // Position, width and height
  position = new Animated.ValueXY();
  width = new Animated.Value();
  height = new Animated.Value();

  /**
   * Main render
   */
  render() {
    const { children } = this.props;

    // Generate interpolated styles
    const styles = {
      ...this.position.getLayout(),
      width: this.width,
      height: this.height,
    };

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.onPress}>
          <View ref={ref => (this.host = ref)}>
            {children}
          </View>
        </TouchableWithoutFeedback>
        <Modal transparent visible={this.isActive} onRequestClose={this.onRequestClose}>
          <TouchableWithoutFeedback onPress={this.onPress} ref={ref => (this.modal = ref)}>
            <Animated.View style={styles}>
              {React.cloneElement(children, { style: { flex: 1 } })}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}
