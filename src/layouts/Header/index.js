import React from 'react';
import { Icon } from 'antd';
import { Link } from 'dva/router';
import styles from './style.less';

function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.logo} />
      <span className={styles.user}>
        <span className={styles.mr10}><Icon type="user" /> admin</span>
        <span className={styles.mr10}><Icon type="lock" /> <Link to="/lock">修改密码</Link></span>
        <span><Icon type="logout" /> <Link to="/login">安全退出</Link></span>
      </span>
    </header>
  );
}

export default Header;
