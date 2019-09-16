const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devServer: {
    proxy: {
      '/api': 'http://localhost:9988'
    }
  },
  entry: './src/index.js',
  output: {
    path: path.join(__dirname,'/public'),
    filename: './assets/js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader', }
      },
      {
        test: /\.css$/,
        use:['style-loader','css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
}
