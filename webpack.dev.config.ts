import path from "path";
import * as webpack from 'webpack';
import 'webpack-dev-server';
import { merge } from "webpack-merge"
import base from "./webpack.base.config"

const config: webpack.Configuration = merge(base, {
  mode: "development",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: "inline-source-map",
  devServer: {
    static: path.join(__dirname, "build"),
    historyApiFallback: true,
    hot: true
  },
});

export default config;
