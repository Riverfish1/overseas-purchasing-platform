var http = require('http');

var options = {  
    hostname: 'https://www.baidu.com',  
    port: 80,  
    path: '/',  
    method: 'GET'  
};  

module.exports = {
  // Forward 到另一个服务器
  'GET /haierp1/static/agent/index.js': function(req, res) {
    var request = http.request(options, function (res1) {
      res1.on('data', function (chunk) {  
        res.json({success: true});
      });
    });
  },
}