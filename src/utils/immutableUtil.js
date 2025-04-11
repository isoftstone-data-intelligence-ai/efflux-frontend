import { fromJS, is } from 'immutable';

/**
 * react 声明周期优化
 */
export function update(nextProps, nextState) {
  return (
    !is(fromJS(this.props), fromJS(nextProps)) ||
    !is(fromJS(this.state), fromJS(nextState))
  );
}

// memo 用
export function updateFn(prevProps, nextProps) {
  return is(fromJS(prevProps), fromJS(nextProps))
}
