import React from 'react';
import { Breadcrumb, Icon } from 'antd';
import styles from './style.less';

function BreadcrumbNavi() {
  return (
    <Breadcrumb className={styles.navigation}>
      <Breadcrumb.Item href="">
        <Icon type="home" />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="">
        <Icon type="user" />
        <span>Application List</span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        Application
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default BreadcrumbNavi;
