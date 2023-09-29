// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const { NODE_ENV = "production" } = process.env;
module.exports = {
  entry: {
    index: "./src/index.ts",
    "create-storage": "./src/create-storage.ts",
    "pull-zone-change-storage": "./src/pull-zone-change-storage.ts",
    "run-purge": "./src/run-purge.ts",
    "remove-old-storage-zones": "./src/remove-old-storage-zones.ts",
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
