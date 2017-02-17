import React from 'react';
import styles from './MainLayout.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

function MainLayout({ children, location }) {
  return (
    <div id="main">
      <Header location={location} />
      <Sidebar />
      <div className={styles.wrapper}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
