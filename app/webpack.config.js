const path = require("path");

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      buffer: require.resolve("buffer/"),
    },
  },
};
