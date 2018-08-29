import * as React from 'react';
import { View, Dimensions, Animated, Platform, Insets } from 'react-native';
import { observer } from 'mobx-react';
import Reanimated from 'react-native-reanimated';
import { TabView, TabBar } from 'react-native-tab-view';
import * as GestureHandler from 'react-native-gesture-handler';
import { autobind } from 'core-decorators';
import { format, addDays } from 'date-fns';
import { runScrollEndSpring } from 'utils/runScrollEndSpring';
const PagerExperimental = require('react-native-tab-view').PagerExperimental;
const styles = require('./WeekTabView.css');

interface IProps {
  testID?: string;
  insets?: Insets;
  render(route: { key: string; date: Date; }): React.ReactNode;
  useScrollView?: boolean;
  hideTabsOnScroll?: boolean;
  selectedTab?: number;
}

const NAVBAR_HEIGHT = 56;
const INITIAL_LAYOUT = {
  height: 0,
  width: Dimensions.get('window').width,
};

@observer
export default class WeekTabView extends React.Component<IProps> {

  // tslint:disable max-line-length
  private tabBar: any;
  private tabBarUpdated: boolean = false;
  private panX = new Animated.Value(0);
  private scrollY = new Reanimated.Value(0);
  private scrollEndDragVelocity = new Reanimated.Value(10000000);
  private snapOffset = new Reanimated.Value(0);
  private clock = new Reanimated.Clock();
  private diffClampNode = Reanimated.diffClamp(Reanimated.add(this.scrollY, this.snapOffset), 0, NAVBAR_HEIGHT);
  private inverseDiffClampNode = Reanimated.multiply(this.diffClampNode, -1);
  private snapPoint = Reanimated.cond(Reanimated.lessThan(this.diffClampNode, NAVBAR_HEIGHT / 2), 0, -NAVBAR_HEIGHT);
  private animatedNavBarTranslateY = Reanimated.cond(
    Reanimated.neq(this.scrollEndDragVelocity, 10000000),
    runScrollEndSpring({
      diffClampNode: this.diffClampNode,
      clock: this.clock,
      from: this.inverseDiffClampNode,
      velocity: 0,
      toValue: this.snapPoint,
      scrollEndDragVelocity: this.scrollEndDragVelocity,
      snapOffset: this.snapOffset,
      height: NAVBAR_HEIGHT,
    }),
    this.inverseDiffClampNode,
  );

  state = {
    index: Number(this.props.selectedTab || 0),
    routes: this.routes,
  };

  get routes() {
    return Array.from({ length: 5 }).map((_, i) => {
      const date = addDays(new Date(), i);
      return {
        date,
        key: String(i),
        title: format(date, 'ddd'),
      };
    });
  }

  @autobind
  onIndexChange(index: number) {
    this.setState({ index });
  }

  @autobind
  renderTabLabel ({ route }: { route: { key: string; title: string; }}) {
    const key = route.key;
    const label = route.title;
    const index = Number(route.key);
    const opacity = this.panX.interpolate({
      inputRange: [index - 0.5, index, index + 0.5],
      outputRange: [
        index === 0 ? 1 : 0,
        1,
        index === this.state.routes.length - 1 ? 1 : 0,
      ],
      extrapolate: 'clamp',
    });

    return (
      <View style={{ position: 'relative' }} key={key}>
        <Animated.Text style={{ color: '#FFFFFF' }}>
          {label}
        </Animated.Text>
        <Animated.Text style={{ opacity, color: '#FF2244', position: 'absolute' }}>
          {label}
        </Animated.Text>
      </View>
    );
  }

  @autobind
  renderTabBar(props: any) {
    const {
      useScrollView = true,
    } = this.props;

    if (this.panX !== props.position) {
      this.panX = props.position;
      // Only way to fix panX on tabs ... until patched
      setTimeout(
        () => {
          if (this.tabBar && !this.tabBarUpdated) {
            this.tabBarUpdated = true;
            this.tabBar.forceUpdate();
          }
        },
        133,
      );
    }

    const posStyle = {
      position: useScrollView  ? 'absolute' : 'relative',
    };

    return (
      <Reanimated.View
        style={[styles.tabbar, posStyle, { transform: [{ translateY: this.animatedNavBarTranslateY }] }]}
      >
        <TabBar
          {...props}
          ref={(ref) => { this.tabBar = ref; }}
          style={[styles.tabbar, posStyle]}
          indicatorStyle={{ backgroundColor: '#FF2244' }}
          renderLabel={Platform.OS === 'ios' ? this.renderTabLabel : undefined}
        />
      </Reanimated.View>
    );
  }

  @autobind
  renderScene(scene: { route: { key: string; date: Date; }}) {
    const {
      insets = {},
      useScrollView = true,
      hideTabsOnScroll = true,
    } = this.props;

    const { top = 0, bottom = 0 } = insets;

    if (useScrollView === false) {
      return this.props.render(scene.route);
    }

    return (
      <Reanimated.ScrollView
        bounces={!hideTabsOnScroll}
        scrollEventThrottle={1}
        contentInsetAdjustmentBehavior="never"
        contentInset={{ bottom: bottom + 16 }}
        contentContainerStyle={{
          marginTop: top + 16,
          paddingBottom: bottom + 16,
        }}
        onScroll={!hideTabsOnScroll ? undefined : Reanimated.event(
          [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
          { useNativeDriver: true },
        )}
        onScrollEndDrag={!hideTabsOnScroll ? undefined : Reanimated.event(
          [{ nativeEvent: { velocity: { y: this.scrollEndDragVelocity } } }],
          { useNativeDriver: true },
        )}
      >
        {this.props.render(scene.route)}
      </Reanimated.ScrollView>
    );
  }

  @autobind
  renderPager(props: any) {
    return (
      <PagerExperimental
        {...props}
        GestureHandler={GestureHandler}
      />
    );
  }

  render() {
    const tabViewProps = { useNativeDriver: true } as any;
    const { top = 0 } = this.props.insets || {};

    return (
      <TabView
        style={[styles.host, { marginTop: top }]}
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        renderPager={this.renderPager}
        onIndexChange={this.onIndexChange}
        initialLayout={INITIAL_LAYOUT}

        {...tabViewProps}
      />
    );
  }
}
