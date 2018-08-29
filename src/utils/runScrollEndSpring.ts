import Reanimated from 'react-native-reanimated';

const { cond, set, sub, multiply, spring, eq, add,
  startClock, clockRunning, stopClock } = Reanimated;

interface IScrollEndProps {
  clock: any;
  from: any;
  velocity: any;
  toValue: any;
  scrollEndDragVelocity: any;
  snapOffset: any;
  diffClampNode: any;
  height: number;
}

export function runScrollEndSpring(props: IScrollEndProps) {

  const {
    clock,
    from,
    velocity,
    toValue,
    scrollEndDragVelocity,
    snapOffset,
    diffClampNode,
    height,
  } = props;

  const state = {
    finished: new Reanimated.Value(0),
    velocity: new Reanimated.Value(0),
    position: new Reanimated.Value(0),
    time: new Reanimated.Value(0),
  };

  const config = {
    damping: 1,
    mass: 1,
    stiffness: 50,
    overshootClamping: true,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Reanimated.Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, from),
      set(config.toValue, toValue),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, [
      set(scrollEndDragVelocity, 10000000),
      set(
        snapOffset,
        cond(
          eq(toValue, 0),
          // SnapOffset acts as an accumulator.
          // We need to keep track of the previous offsets applied.
          add(snapOffset, multiply(diffClampNode, -1)),
          add(snapOffset, sub(height, diffClampNode)),
        ),
      ),
      stopClock(clock),
    ]),
    state.position,
  ];
}
