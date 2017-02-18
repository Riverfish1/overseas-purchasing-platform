export default {
  // 支持值为 Object 和 Array
  'GET /mock/users': { users: [1,2] },
  'GET /haierp1/haiLogin/agent/index.js': function(req, res) {
    res.redirect('http:\/\/localhost:8000\/index.js');
  },
  'GET /haierp1/haiLogin/index.js': function(req, res) {
    res.redirect('http:\/\/localhost:8000\/index.js');
  },
  'GET /sockjs-node/info': function(req, res) {
    res.redirect('http:\/\/localhost:8000\/sockjs-node/info?t=' + new Date().getTime());
  },
  'GET /mock/products': {
    dataSource: [
      {
        id: 1,
        productsName: '测试商品',
        productsCode: 'ITEM10018',
        productsImage: '0',
        productsBrand: 'Hollister',
        salesType: '代购',
        productsCategory: '衣服',
        purchaseDest: '杭州',
        startTime: '2016-01-01',
        endTime: '2017-01-01'
      },
      {
        id: 2,
        productsName: '测试商品1',
        productsCode: 'ITEM1001811',
        productsImage: '022',
        productsBrand: 'Hollister334',
        salesType: '自购',
        productsCategory: '家电',
        purchaseDest: '上海',
        startTime: '2015-01-01',
        endTime: '2017-01-01'
      },
    ],
    modalData: [
      {
        id: 1,
        size: 30,
        color: '白',
        inventory: 50,
        virtualInventory: 400,
        barcode: 'fjdhgf',
        weight: 10,
      },
      {
        id: 2,
        size: 30,
        color: '白',
        inventory: 50,
        virtualInventory: 400,
        barcode: 'fjdhgf',
        weight: 10,
      },
      {
        id: 3,
        size: 30,
        color: '白',
        inventory: 50,
        virtualInventory: 400,
        barcode: 'fjdhgf',
        weight: 10,
      },
    ],
  },
};
