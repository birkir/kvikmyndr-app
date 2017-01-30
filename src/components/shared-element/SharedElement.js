/* global requestAnimationFrame */
import React, { Component, PropTypes } from 'react';
import { Modal, Animated, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { autobind } from 'core-decorators';

const animate = (prop, toValue) => Animated.timing(prop, { toValue, duration: 250 });
const sharedElements = new Map();

@observer
export default class SharedElement extends Component {

  static contextTypes = {
    navigationState: PropTypes.object,
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
    x: PropTypes.number,
  };

  static defaultProps = {
    children: undefined,
    x: undefined,
  };

  componentDidMount() {
    const { name } = this.props;
    if (sharedElements.has(name)) {
      this.mode = SharedElement.RECEIVING;
      this.opacity = 0;
      this.parent = sharedElements.get(name);
      if (this.parent) {
        requestAnimationFrame(() => {
          this.host.measureInWindow((xo, y) => {
            const x = this.props.x || xo;
            animate(this.parent.position, { x, y })
            .start(() => {
              this.parent.isActive = false;
              this.opacity = 1;
              sharedElements.delete(name);
            });
          });
        });
      }
    }
  }

  @autobind
  onRequestClose() {
    this.isActive = false;
    return null;
  }

  reverse() {
    if (this.parent && this.parent.host) {
      // this.parent.opacity = 0;
      this.host.measureInWindow((x, y, w, h) => {
        // // Start by setting active flag
        this.isActive = true;
        this.opacity = 0;

        // Show overlay in host position (ghost mode)
        this.position.setValue({ x, y });
        this.width.setValue(w);
        this.height.setValue(h);

        this.parent.host.measureInWindow((rx, ry) => {
          animate(this.position, { x: rx, y: ry })
          .start(() => {
            this.isActive = false;
          });
        });
      });
    }
  }

  prepare() {
    const { name } = this.props;
    if (!sharedElements.has(name)) {
      sharedElements.set(name, this);
      this.host.measureInWindow((x, y, w, h) => {
        // Start by setting active flag
        this.isActive = true;

        // Show overlay in host position (ghost mode)
        this.position.setValue({ x, y });
        this.width.setValue(w);
        this.height.setValue(h);
      });
    }
  }

  // Position, width and height
  position = new Animated.ValueXY();
  width = new Animated.Value();
  height = new Animated.Value();

  @observable
  isActive = false;

  @observable
  opacity = 1;

  /**
   * Main render
   */
  render() {
    const { children } = this.props;
    const { opacity } = this;

    // Generate interpolated styles
    const styles = {
      ...this.position.getLayout(),
      width: this.width,
      height: this.height,
    };

    return (
      <View>
        <View ref={ref => (this.host = ref)} style={{ opacity }}>
          {children}
        </View>
        <Modal transparent visible={this.isActive} onRequestClose={this.onRequestClose}>
          <Animated.View style={styles} onClick={this.onRequestClose}>
            {children}
          </Animated.View>
        </Modal>
      </View>
    );
  }
}
