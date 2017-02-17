import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import styles from './Header.css'

function Footer({ location }) {
  return (
    <footer className={styles.footer}>
      Copyright © 2015 power by <a href="http://www.dreamlu.net" target="_blank" rel="noopener" >如梦技术</a>
    </footer>
  );
}

export default Footer;
