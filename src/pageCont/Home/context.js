import React from 'react';
// 1. 创建上下文
const Context = React.createContext();

const withProvider = (data = {}) => Comp => props => {
  return (
    <Context.Provider value={data}>
      <Comp {...props}></Comp>
    </Context.Provider>
  );
};

const withConsumer = Comp => props => {
  return (
    <Context.Consumer>
      {/* 必须内嵌一个函数 */}
      {value => <Comp {...props} value={value}></Comp>}
    </Context.Consumer>
  );
};

export { Context, withProvider, withConsumer };
export default { Context, withProvider, withConsumer };
