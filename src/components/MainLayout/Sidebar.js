import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import styles from './Sidebar.css';

const SubMenu = Menu.SubMenu;

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Menu
        mode="inline"
        theme="dark"
      >
        <SubMenu key="permissionMng" title={<span><Icon type="folder" /><span>权限管理</span></span>}>
          <Menu.Item key="sourceMng"><Link to="/products"><Icon type="folder" /> 资源管理</Link></Menu.Item>
          <Menu.Item key="roleMng"><Link to="/products"><Icon type="folder" /> 角色管理</Link></Menu.Item>
          <Menu.Item key="userMng"><Link to="/products"><Icon type="folder" /> 用户管理</Link></Menu.Item>
          <Menu.Item key="departmentMng"><Link to="/products"><Icon type="folder" /> 部门管理</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="product" title={<span><Icon type="folder" /><span>商品</span></span>}>
          <Menu.Item key="productMng"><Link to="/products"><Icon type="appstore" /> 商品管理</Link></Menu.Item>
          <Menu.Item key="skuMng"><Link to="/products"><Icon type="folder" /> SKU管理</Link></Menu.Item>
          <Menu.Item key="categoryMng"><Link to="/products"><Icon type="folder" /> 类目管理</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="videoTutorial" title={<span><Icon type="folder" /><span>视频教程</span></span>}>
          <Menu.Item key="officialSite"><Link to="/products"><Icon type="folder" /> 官方网站</Link></Menu.Item>
          <Menu.Item key="jfVideo"><Link to="/products"><Icon type="video-camera" /> jfinal视频</Link></Menu.Item>
        </SubMenu>
        <SubMenu key="logMonitor" title={<span><Icon type="folder" /><span>日志监控</span></span>}>
          <Menu.Item key="entryLog"><Link to="/products"><Icon type="folder" /> 登录日志</Link></Menu.Item>
          <Menu.Item key="druidMonitor"><Link to="/products"><Icon type="folder" /> Druid监控</Link></Menu.Item>
          <Menu.Item key="systemIcon"><Link to="/products"><Icon type="folder" /> 系统图标</Link></Menu.Item>
        </SubMenu>
      </Menu>
    </aside>
  );
}

export default Sidebar;
