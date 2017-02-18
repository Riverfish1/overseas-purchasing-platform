/* eslint-disable object-property-newline */
export const PAGE_SIZE = 3;

// 路由字符串常量配置
export const routerCfg = {
  // 登录
  LOGIN: 'login',
  // 总览
  OVERVIEW: 'overview',
  // 商品管理
  PRODUCTS: 'products',
  PRODUCTS_LIST: 'productsList',
  SKU_LIST: 'skuList',
  CATE_LIST: 'cateList',
  // 销售管理
  SALE: 'sale',
  ORDER_LIST: 'orderList',
};

export const navigation = [
  { key: routerCfg.OVERVIEW, name: '总览', icon: 'laptop' },
  { key: routerCfg.PRODUCTS, name: '商品管理', icon: 'bars',
    child: [
      { key: routerCfg.PRODUCTS_LIST, name: '商品列表', icon: 'bars' },
      { key: routerCfg.SKU_LIST, name: 'SKU管理', icon: 'bars' },
      { key: routerCfg.CATE_LIST, name: '类目管理', icon: 'bars' },
    ],
  },
  { key: routerCfg.SALE, name: '销售管理', icon: 'book',
    child: [
      { key: routerCfg.ORDER_LIST, name: '订单管理' },
    ],
  },
];
