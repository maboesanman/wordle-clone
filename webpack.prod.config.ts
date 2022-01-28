import path from "path";
import { Configuration } from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { merge } from "webpack-merge"
import base from "./webpack.base.config"

const config: Configuration = merge(base, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    publicPath: "",
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
});

export default config;
