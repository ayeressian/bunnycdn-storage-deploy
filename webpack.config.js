// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const { NODE_ENV = "production" } = process.env;
module.exports = {
  entry: "./src/index.ts",
  devtool: "source-map",
  mode: NODE_ENV,
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader" }],
  },
  optimization: {
    minimize: false,
  },
};
