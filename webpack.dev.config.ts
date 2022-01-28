import { Configuration, HotModuleReplacementPlugin } from "webpack";
import { merge } from "webpack-merge"
import base from "./webpack.base.config"

const config: Configuration = merge(base, {
  mode: "development",
  plugins: [
    new HotModuleReplacementPlugin(),
  ],
  devtool: "inline-source-map",
  // devServer: {
  //   static: path.join(__dirname, "build"),
  //   historyApiFallback: true,
  //   port: 4000,
  //   open: true,
  //   hot: true
  // },
});

export default config;
