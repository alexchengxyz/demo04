const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");


let __devServerProxyURL

if (process.NODE_ENV === 'dev') {
  __devServerProxyURL = 'http://localhost:9988'
}


module.exports = {
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
  ],
  devServer: {
    proxy: {
      '/api': __devServerProxyURL  
    }
  }
}
