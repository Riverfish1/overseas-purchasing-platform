import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import styles from './style.less';

const SubMenu = Menu.SubMenu;

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Menu
        mode="inline"
        theme="dark"
      >
        <SubMenu key="permissionMng" title={<span><Icon type="folder" /><span>权限管理</span></span>} />
        <SubMenu key="product" title={<span><Icon type="folder" /><span>商品</span></span>}>
          <Menu.Item key="productMng"><Link to="/products"><Icon type="appstore" /> 商品管理</Link></Menu.Item>
          <Menu.Item key="skuMng"><Link to="/products"><Icon type="folder" /> SKU管理</Link></Menu.Item>
          <Menu.Item key="categoryMng"><Link to="/products"><Icon type="folder" /> 类目管理</Link></Menu.Item>
        </SubMenu>
      </Menu>
    </aside>
  );
}

export default Sidebar;
