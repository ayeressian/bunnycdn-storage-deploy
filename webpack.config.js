// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const { NODE_ENV = "production" } = process.env;
module.exports = {
  entry: {
    index: "./src/index.ts",
    createStorage: "./src/create-storage.ts",
  },
  devtool: "source-map",
  mode: NODE_ENV,
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader" }],
  },
};
