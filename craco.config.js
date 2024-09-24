module.exports = {
  reactScriptsVersion: "react-scripts" /* (default value) */,
  webpack: {
    mode: "extends",
    configure: {
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: "pre",
            use: ["source-map-loader"],
          },
        ],
      },
      resolve: {
        fallback: {
          assert: require.resolve("assert"),
          buffer: require.resolve("buffer"),
          crypto: require.resolve("crypto-browserify"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          stream: require.resolve("stream-browserify"),
          url: require.resolve("url/"),
          zlib: require.resolve("browserify-zlib"),
        },
      },
      ignoreWarnings: [/Failed to parse source map/],
    },
  },
};
