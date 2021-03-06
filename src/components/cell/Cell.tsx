import * as React from 'react';
import {
  View,
  Text,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  Image,
  GestureResponderEvent,
  SafeAreaView,
} from 'react-native';
import { observer, Observer } from 'mobx-react';
import { observable } from 'mobx';
import { autobind } from 'core-decorators';
const styles = require('./Cell.css');

interface IProps {
  id?: any;
  key?: string;
  index?: number;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  value?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  bordered?: boolean;
  more?: boolean;
  selected?: boolean;
  onPress?(e: GestureResponderEvent, props: IProps): void;
  onPressIn?(e: GestureResponderEvent, props: IProps): void;
  onLongPress?(e: GestureResponderEvent, props: IProps): void;
  disabled?: boolean;
  numberOfLines?: number;
  testID?: string;
  item?: any;
}

const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;

@observer
export default class Cell extends React.Component<IProps, any> {

  @observable
  isUnderlay = false;

  @autobind
  onShowUnderlay() {
    this.isUnderlay = true;
  }

  @autobind
  onHideUnderlay() {
    this.isUnderlay = false;
  }

  @autobind
  onPress(e: GestureResponderEvent) {
    if (this.props.onPress) {
      this.props.onPress(e, this.props);
    }
  }

  @autobind
  onPressIn(e: GestureResponderEvent) {
    if (this.props.onPressIn) {
      this.props.onPressIn(e, this.props);
    }
  }

  @autobind
  onLongPress(e: GestureResponderEvent) {
    if (this.props.onLongPress) {
      this.props.onLongPress(e, this.props);
    }
  }

  renderTitle() {
    const { title, numberOfLines = 1 } = this.props;

    if (!title) return null;

    if (typeof title === 'object' && React.isValidElement(title)) {
      return title;
    }

    return (
      <View style={styles.title}>
        <Text style={styles.title__text} numberOfLines={numberOfLines}>{String(title)}</Text>
      </View>
    );
  }

  renderSubtitle() {
    const { subtitle } = this.props;

    if (!subtitle) return null;

    if (typeof subtitle === 'object' && React.isValidElement(subtitle)) {
      return subtitle;
    }

    return (
      <View style={styles.subtitle}>
        <Text style={styles.subtitle__text}>{String(subtitle)}</Text>
      </View>
    );
  }

  @autobind
  renderValue() {
    const { value } = this.props;

    if (!value) return null;

    if (typeof value === 'object' && React.isValidElement(value)) {
      return value;
    }

    return (
      <View style={styles.value}>
        <Text style={styles.value__text}>{String(value)}</Text>
      </View>
    );
  }

  renderLeft() {
    const { left } = this.props;

    if (!left) return null;

    if (typeof left === 'object' && React.isValidElement(left)) {
      return (
        <View style={styles.left}>
          {left}
        </View>
      );
    }
  }

  renderRight() {
    const { right } = this.props;

    if (!right) return null;

    if (typeof right === 'object' && React.isValidElement(right)) {
      return right;
    }
  }

  render() {
    const {
      bordered = true,
      index,
      more,
      selected,
      disabled,
      onPress,
      onPressIn,
      onLongPress,
      testID,
    } = this.props;

    const border = bordered && (typeof index === 'undefined' || index > 0);

    return (
      <Touchable
        onPress={onPress && this.onPress}
        onPressIn={onPressIn && this.onPressIn}
        onLongPress={onLongPress && this.onLongPress}
        underlayColor="transparent"
        activeOpacity={1}
        onShowUnderlay={this.onShowUnderlay}
        onHideUnderlay={this.onHideUnderlay}
        disabled={disabled}
        testID={testID}
      >
        <SafeAreaView>
          <View
            style={[
              styles.host,
              this.isUnderlay && styles.host__underlay,
            ]}
          >
            {this.renderLeft()}
            <View style={styles.content}>
              {!this.isUnderlay && border && <View style={styles.content__border} />}
              <View style={styles.center}>
                {this.renderTitle()}
                {this.renderSubtitle()}
              </View>
              <View style={styles.right}>
                {this.renderRight()}
                <Observer render={this.renderValue} />
                {selected && (
                  <Image
                    source={require('../../assets/icons/cell-check.png')}
                    style={styles.icon__selected}
                  />
                )}
                {more && (
                  <Image
                    source={require('../../assets/icons/cell-chevron.png')}
                    style={styles.icon__more}
                  />
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Touchable>
    );
  }
}
