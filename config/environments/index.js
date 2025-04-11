// 基础配置 （每个环境都一样的）
const base = require('./base')

// 获取配置
function getEvnData(env) {
  var envData = {};
  if (env == 'localhost') envData = require('./localhost');
  if (env == 'dev') envData = require('./dev');
  if (env == 'test') envData = require('./test');
  return { ...base, ...envData };
}

exports.getEvnData = getEvnData