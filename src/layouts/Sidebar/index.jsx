import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import { navigation } from '../../constants';
import styles from './style.less';

const topMenus = navigation.map(item => item.key);

const getMenus = (menuArray, siderFold, pPath) => {
  const parentPath = pPath || '/';
  return menuArray.map((item) => {
    if (item.child) {
      return (
        <Menu.SubMenu key={item.key} title={<span>{item.icon ? <Icon type={item.icon} /> : ''}{siderFold && topMenus.indexOf(item.key) >= 0 ? '' : item.name}</span>}>
          {getMenus(item.child, siderFold, `${parentPath + item.key}/`)}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.key}>
          <Link to={parentPath + item.key}>
            {item.icon ? <Icon type={item.icon} /> : ''}
            {siderFold && topMenus.indexOf(item.key) >= 0 ? '' : item.name}
          </Link>
        </Menu.Item>
      );
    }
  });
};

class Menus extends Component {
  constructor() {
    super();
    this.state = {
      siderFold: false,
      navOpenKeys: [],
    };
  }
  componentDidMount() {
    setTimeout(() => {
      const { location } = this.props;
      const parent = location.pathname.split('/')[1];
      this.changeOpenKeys(parent ? [parent] : []);
    }, 100);
  }
  changeOpenKeys(navOpenKeys) {
    this.setState({ navOpenKeys });
  }
  render() {
    const { location } = this.props;
    const { /* navOpenKeys, */siderFold } = this.state;
    const menuItems = getMenus(navigation, siderFold);
    // const onOpenChange = (openKeys) => {
    //   const latestOpenKey = openKeys.find(key => !(navOpenKeys.indexOf(key) > -1));
    //   const latestCloseKey = navOpenKeys.find(key => !(openKeys.indexOf(key) > -1));
    //   let nextOpenKeys = [];
    //   if (latestOpenKey) {
    //     nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    //   }
    //   if (latestCloseKey) {
    //     nextOpenKeys = getAncestorKeys(latestCloseKey);
    //   }
    //   this.changeOpenKeys(nextOpenKeys);
    // };
    // const getAncestorKeys = (key) => {
    //   const map = {
    //     navigation2: ['navigation'],
    //   };
    //   return map[key] || [];
    // };
    // 菜单栏收起时，不能操作openKeys
    // const menuProps = !siderFold ? {
    //   onOpenChange,
    //   openKeys: navOpenKeys,
    // } : {};

    return (
      <aside className={styles.sidebar}>
        <Menu
          /* ...menuProps */
          mode={siderFold ? 'vertical' : 'inline'}
          theme="dark"
          defaultSelectedKeys={[location.pathname.split('/')[location.pathname.split('/').length - 1] || 'overview']}
        >
          {menuItems}
        </Menu>
      </aside>
    );
  }
}

export default Menus;
