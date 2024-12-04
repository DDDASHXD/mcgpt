const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    content: {
      import: ['./src/content.js', './src/content.css'],
      filename: 'content.js'
    },
    background: {
      import: './src/background.js',
      filename: 'background.js'
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        { from: "config.template.json", to: "config.template.json" },
        { from: "src/popup", to: "popup" },
        { from: "src/popup/popup.js", to: "popup/popup.js" },
        { from: "src/popup/popup.css", to: "popup/popup.css" },
        { from: "icons", to: "icons" },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: (module, chunks, cacheGroupKey) => {
        const allChunksNames = chunks.map(item => item.name).join('~');
        return `vendor-${allChunksNames}`;
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
}; 