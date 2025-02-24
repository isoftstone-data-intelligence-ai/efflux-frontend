// next.config.js
module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // 忽略构建时的 ESLint 错误
  },
  typescript: {
    ignoreBuildErrors: true, // 忽略构建时的错误
  },
};