const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/app-web-ui/initialize-web-ui.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "3 Strikes Game",
      favicon: path.resolve(__dirname, "src", "app-web-ui", "favicon.ico"),
    }),
  ],
  output: {
    filename: "3-strikes-game-web-ui-bundle.[name].js",
    path: path.resolve(__dirname, "dist-web"),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
