const path = require('path');

module.exports = {
  mode: 'development',
  entry: './public/js/main.js',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: 'bundle.js',
  },
};