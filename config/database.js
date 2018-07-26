if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://jude:digitzs1@ds253821.mlab.com:53821/vid-jot'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost:27017/vidjot-dev'}
}