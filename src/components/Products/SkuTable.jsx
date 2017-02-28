import React, { Component } from 'react';
import { Row, Col, Table, Input, Button, Popconfirm } from 'antd';

import styles from './Products.less';

class SkuTable extends Component {
  constructor() {
    super();
    this.state = { skuData: [
      {
        id: 1,
        scale: 'a',
        color: 'b',
        virtualInventory: 'c',
        skuCode: 'd',
        weight: 'e',
      },
    ] };
    this.skuInputs = {};
  }
  componentWillReceiveProps(...args) {
    console.log(args);
  }
  getValue() {
    console.log(this.skuInputs);
    const skuInputs = this.skuInputs;
    const valueArr = [];
    Object.keys(skuInputs).forEach((key) => {
      const valueObj = {};
      Object.keys(skuInputs[key]).forEach((item) => {
        valueObj[item] = skuInputs[key][item].refs.input.value; // dom元素取值
      });
      valueArr.push(valueObj);
    });
    return valueArr;
  }
  updateItem(id, name, c) { // 仅保存dom
    if (!this.skuInputs[`r_${id}`]) {
      this.skuInputs[`r_${id}`] = {};
    }
    this.skuInputs[`r_${id}`][name] = c;
    return true;
  }
  addItem() {
    const { skuData } = this.state;
    const skuLen = skuData.length;
    const lastId = skuLen < 1 ? 1 : skuData[skuData.length - 1].id;
    const newId = parseInt(lastId, 10) + 1;
    const newItem = {
      id: newId,
      key: newId,
      scale: '',
      color: '',
      virtualInventory: '',
      skuCode: '',
      weight: '',
    };
    skuData.push(newItem);
    this.setState({ skuData });
  }
  delItem(id) {
    console.log(id);
    const p = this;
    const { skuData } = this.state;
    const newSkuData = skuData.filter(item => id !== item.id);
    this.setState({ skuData: newSkuData }, () => {
      setTimeout(() => {
        // 同时删除保存的dom
        const newInputs = {};
        Object.keys(p.skuInputs).forEach((key) => {
          if (key !== `r_${id}`) {
            console.log(key, `r_${id}`, key === `r_${id}`);
            newInputs[key] = p.skuInputs[key];
          }
        });
        console.log(newInputs);
        p.skuInputs = { ...newInputs };
        console.log(p.skuInputs);
      }, 20);
    });
  }
  render() {
    const p = this;
    const { skuData } = this.state;
    const modalTableProps = {
      columns: [
        {
          title: '尺寸',
          dataIndex: 'scale',
          key: 'scale',
          width: '18%',
          render(t, r) { return <Input placeholder="请填写" defaultValue={t} ref={(c) => { p.updateItem(r.id, 'scale', c); }} />; },
        },
        {
          title: '颜色',
          dataIndex: 'color',
          key: 'color',
          width: '18%',
          render(t, r) { return <Input placeholder="请填写" defaultValue={t} ref={(c) => { p.updateItem(r.id, 'color', c); }} />; },
        },
        {
          title: '虚拟库存',
          dataIndex: 'virtualInventory',
          key: 'virtualInventory',
          width: '18%',
          render(t, r) { return <Input placeholder="请填写" defaultValue={t} ref={(c) => { p.updateItem(r.id, 'virtualInventory', c); }} />; },
        },
        {
          title: 'SKU条码',
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: '18%',
          render(t, r) { return <Input placeholder="请填写" defaultValue={t} ref={(c) => { p.updateItem(r.id, 'skuCode', c); }} />; },
        },
        {
          title: '重量(KG)',
          dataIndex: 'weight',
          key: 'weight',
          width: '18%',
          render(t, r) { return <Input placeholder="请填写" defaultValue={t} ref={(c) => { p.updateItem(r.id, 'weight', c); }} />; },
        },
        {
          title: '操作',
          key: 'operator',
          render(text, record) {
            return (
              <Popconfirm title="确定删除?" onConfirm={p.delItem.bind(p, record.id)}>
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            );
          },
        },
      ],
      dataSource: skuData,
      bordered: false,
    };

    return (
      <Row>
        <Col className={styles.productModalBtn}>
          <Button type="primary" onClick={this.addItem.bind(this)}>新增SKU</Button>
        </Col>
        <Table
          {...modalTableProps}
          rowKey={record => record.id}
        />
      </Row>
    );
  }
}

export default SkuTable;
