const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
let devServerHost;
let devClientPort;
let devServerPort;

if (process.env.NODE_ENV === 'dev') {
  devServerHost = '192.168.56.101';
  devClientPort = 8080;
  devServerPort = 9988;
}

module.exports = {
  devServer: {
    host: devServerHost,
    compress: true,
    port: devClientPort,
    proxy: {
      '/api': 'http://' + devServerHost + ':' + devServerPort
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
