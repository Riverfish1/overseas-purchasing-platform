export default {
  // 支持值为 Object 和 Array
  'GET /mock/users': { users: [1,2] },
  'GET /haierp1/web/index.js': function(req, res) {
    res.redirect('http:\/\/localhost:8000\/index.js');
  },
  'GET /sockjs-node/info': function(req, res) {
    res.redirect('http:\/\/localhost:8000\/sockjs-node/info?t=' + new Date().getTime());
  },
  'POST /item/queryItemList': {
    "success": true,
    "msg": "",
    "data": [
      {
        "id": 27,
        "name": "测试商品1",
        "categoryId": 103,
        "categoryName": "衣服",
        "itemCode": "ITEM10018",
        "isNew": 0,
        "saleType": 0,
        "mainPic": "0",
        "itemShort": "abc",
        "enName": "abc",
        "brand": "",
        "country": 0,
        "currency": 1,
        "buySite": "",
        "origin": "",
        "weight": null,
        "unit": "",
        "source": "",
        "promotion": null,
        "contactPerson": "",
        "contactTel": "",
        "idCard": 1,
        "startDate": "2017-02-08 00:00:00",
        "endDate": "2017-02-16 00:00:00",
        "gmtCreate": "2017-02-14 14:13:14",
        "gmtModify": "2017-02-14 19:31:19",
        "userCreate": null,
        "userModify": null,
        "itemSkus": [],
        "skuList": null,
        "status": 0,
        "remark": "爱爱爱",
        "numIid": null,
        "spec": "",
        "model": "",
        "startDateStr": "2017-02-08",
        "endDateStr": "2017-02-16"
      },
      {
        "id": 28,
        "name": "Nike",
        "categoryId": 102,
        "categoryName": "小家电111",
        "itemCode": "ITEM10021",
        "isNew": 0,
        "saleType": 0,
        "mainPic": "0",
        "itemShort": "Nike",
        "enName": "Nike",
        "brand": "Hollister",
        "country": 1,
        "currency": 1,
        "buySite": "",
        "origin": "",
        "weight": null,
        "unit": "",
        "source": "",
        "promotion": null,
        "contactPerson": "",
        "contactTel": "",
        "idCard": 1,
        "startDate": null,
        "endDate": null,
        "gmtCreate": "2017-02-16 20:32:32",
        "gmtModify": "2017-02-16 20:32:49",
        "userCreate": null,
        "userModify": null,
        "itemSkus": [],
        "skuList": null,
        "status": 0,
        "remark": "",
        "numIid": null,
        "spec": "",
        "model": "",
        "startDateStr": "",
        "endDateStr": ""
      }
    ],
    "pageIndex": 1,
    "totalCount": 2,
    "totalPage": 1,
    "firstStart": 0
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
