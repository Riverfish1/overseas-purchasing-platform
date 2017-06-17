/* eslint-disable object-property-newline */
export const API_URL = 'http://118.178.126.143/haierp1/haiLogin';

// 后端权限码映射
export const backendCfg = {
  products: 'item',
  productsList: 'item_list',
  skuList: 'item_skulist',
  packageScale: 'item_scale',
  packageLevel: 'item_level',
  category: 'category',
  sale: 'sale',
  orderList: 'sale_outerorder',
  erpOrder: 'sale_erporder',
  shippingOrder: 'sale_shippingorder',
  purchase: 'purchase',
  purchaseList: 'purchase_task',
  purchaseStorage: 'purchase_storage',
  person: 'seller',
  agencyType: 'seller_type',
  agencyList: 'seller_list',
  inventory: 'inventory',
  inventoryList: 'inventory_list',
  warehouse: 'inventory_warehouse',
  inout: 'inventory_inout',
  // 内置
  overview: 'overview',
};

// 路由字符串常量配置
export const routerCfg = {
  // 登录
  LOGIN: 'login',
  // 总览
  OVERVIEW: 'overview',
  // 权限管理
  PERMISSION: 'permission',
  ROLE: 'role',
  RESOURCE: 'resource',
  USER: 'user',
  ORGANIZATION: 'organization',
  // 商品管理
  PRODUCTS: 'products',
  PRODUCTS_LIST: 'productsList',
  SKU_LIST: 'skuList',
  CATE_LIST: 'cateList',
  PACKAGE_SCALE: 'packageScale',
  PACKAGE_LEVEL: 'packageLevel',
  // 销售管理
  SALE: 'sale',
  ORDER_LIST: 'orderList',
  ERP_ORDER: 'erpOrder',
  SHIPPING_ORDER: 'shippingOrder',
  // 采购管理
  PURCHASE: 'purchase',
  PURCHASE_LIST: 'purchaseList',
  PURCHASE_STORAGE: 'purchaseStorage',
  CHECK: 'check', // 盘点管理
  JOURNAL: 'journal', // 流水管理
  RECEIPT: 'receipt', // 小票管理
  // 客户管理
  PERSON: 'person',
  AGENCY_LIST: 'agencyList',
  AGENCY_TYPE: 'agencyType',
  // 库存管理
  INVENTORY: 'inventory',
  INVENTORY_LIST: 'inventoryList',
  WAREHOUSE: 'warehouse', // 仓库管理
  INOUT: 'inout', // 出入库管理
};

export const originalNavigation = [
  { key: routerCfg.OVERVIEW, name: '总览', icon: 'laptop' },
  // { key: routerCfg.PERMISSION, name: '权限管理', icon: 'team',
  //   child: [
  //     { key: routerCfg.RESOURCE, name: '资源管理' },
  //     { key: routerCfg.ROLE, name: '角色管理' },
  //     { key: routerCfg.USER, name: '用户管理' },
  //     { key: routerCfg.ORGANIZATION, name: '部门管理' },
  //   ],
  // },
  { key: routerCfg.PRODUCTS, name: '商品管理', icon: 'bars',
    child: [
      { key: routerCfg.PRODUCTS_LIST, name: '商品列表' },
      { key: routerCfg.SKU_LIST, name: 'SKU管理' },
      { key: routerCfg.CATE_LIST, name: '类目管理' },
      { key: routerCfg.PACKAGE_SCALE, name: '包装规格类别' },
      { key: routerCfg.PACKAGE_LEVEL, name: '包装规格' },
    ],
  },
  { key: routerCfg.SALE, name: '销售管理', icon: 'book',
    child: [
      { key: routerCfg.ORDER_LIST, name: '主订单管理' },
      { key: routerCfg.ERP_ORDER, name: '子订单管理' },
      { key: routerCfg.SHIPPING_ORDER, name: '发货单管理' },
    ],
  },
  { key: routerCfg.PURCHASE, name: '采购管理', icon: 'appstore-o',
    child: [
      { key: routerCfg.PURCHASE_LIST, name: '采购管理' },
      // { key: routerCfg.CHECK,
      //   name: '盘点管理',
      //   child: [
      //     { key: routerCfg.JOURNAL, name: '流水管理' },
      //     { key: routerCfg.RECEIPT, name: '小票管理' },
      //   ],
      // },
      { key: routerCfg.PURCHASE_STORAGE, name: '采购入库管理' },
    ],
  },
  { key: routerCfg.PERSON, name: '客户管理', icon: 'user',
    child: [
      { key: routerCfg.AGENCY_LIST, name: '销售管理' },
      { key: routerCfg.AGENCY_TYPE, name: '销售类别' },
    ],
  },
  { key: routerCfg.INVENTORY, name: '库存管理', icon: 'shopping-cart',
    child: [
      { key: routerCfg.INVENTORY_LIST, name: '库存管理' },
      { key: routerCfg.WAREHOUSE, name: '仓库管理' },
      { key: routerCfg.INOUT, name: '出入库记录' },
    ],
  },
];

let navigation = [];

export function getNavigation() { return navigation; }
export function setNavigation(data) { navigation = data; }
