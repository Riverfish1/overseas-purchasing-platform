import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import { routerCfg, navigation } from '../../constants';
import styles from './style.less';

export default class Header extends React.Component {
  render() {
    const { pathname } = this.props.location;
    return (
      <header className={styles.header}>
        <span className={styles.logo} />
        <Menu
          className={styles.navi}
          mode="horizontal"
          selectedKeys={[pathname.split('/')[1] || 'overview']}
        >
          {navigation.map((item) => {
            return (
              <Menu.Item
                key={item.key}
              >
                <Link to={`/${item.key}`}>
                  {item.icon ? <Icon type={item.icon} /> : ''}
                  {item.name}
                </Link>
              </Menu.Item>
            );
          })}
        </Menu>
        <span className={styles.user}>
          <span className={styles.mr10}><Icon type="user" /> admin</span>
          {/* <span className={styles.mr10}><Icon type="lock" /> <Link to="/lock">修改密码</Link></span> */}
          <span><Icon type="logout" /> <Link to={`/${routerCfg.LOGIN}`}>安全退出</Link></span>
        </span>
      </header>
    );
  }
}
