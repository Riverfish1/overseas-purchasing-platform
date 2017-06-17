import React from 'react';
import classNames from 'classnames';
import styles from './style.less';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Breadcrumb from '../Breadcrumb';
import HistoryTab from '../HistoryTab';
import { routerCfg } from '../../constants';

function MainLayout({ children, location }) {
  const { pathname } = location;
  const showLogin = pathname === `/${routerCfg.LOGIN}`;
  const showSideBar = pathname === '/overview';
  const wrapperClass = classNames({
    [styles.wrapper]: true,
    [styles.loginWrapper]: showLogin,
    [styles.noSidebar]: showSideBar,
  });
  return (
    <div id="main">
      {!showLogin && <Header location={location} />}
      {!showLogin && !showSideBar && <Sidebar location={location} />}
      <div className={wrapperClass}>
        {!showLogin && <HistoryTab location={location} />}
        {!showLogin && <Breadcrumb location={location} />}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
