export default {
  // 支持值为 Object 和 Array
  'GET /mock/users': { users: [1,2] },
  'GET /haierp1/web/index.js': function(req, res) {
    res.redirect('http:\/\/localhost:8000\/index.js');
  },
  'GET /haierp1/index.js': function(req, res) {
    res.redirect('http:\/\/localhost:8000\/index.js');
  },
  'GET /*.js': function(req, res) {
    res.redirect('http:\/\/localhost:8000\/*.js');
  },
  'GET /sockjs-node/info': function(req, res) {
    res.redirect('http:\/\/localhost:8000\/sockjs-node/info?t=' + new Date().getTime());
  }
};
