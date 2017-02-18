import React from 'react';
import classNames from 'classnames';
import styles from './style.less';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Breadcrumb from '../Breadcrumb';

function MainLayout({ children, location }) {
  const { pathname } = location;
  const showLogin = pathname === '/login';
  const wrapperClass = classNames({
    [styles.wrapper]: true,
    [styles.loginWrapper]: showLogin,
  });
  return (
    <div id="main">
      {!showLogin && <Header location={location} />}
      {!showLogin && <Sidebar />}
      <div className={wrapperClass}>
        {!showLogin && <Breadcrumb />}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
