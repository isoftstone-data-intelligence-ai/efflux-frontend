/**
 * 基础
 */

var fs = require('fs');
const packageFile = JSON.parse(fs.readFileSync('./package.json'));


module.exports = {
  // 环境
  'environment': process.env.PROJECT_ENV,
  'nodeEnv': process.env.NODE_ENV,

  // iconFont 图标地址
  'iconFontUrl': '//at.alicdn.com/t/c/font_4262248_ggh7ezz8087.js',
};
