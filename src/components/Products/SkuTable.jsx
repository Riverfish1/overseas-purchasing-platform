import React, { Component } from 'react';
import { Row, Col, Form, Table, Input, InputNumber, Button, Popconfirm, message } from 'antd';

import styles from './Products.less';

const FormItem = Form.Item;

class SkuTable extends Component {
  constructor() {
    super();
    this.state = { skuData: [] };
  }
  componentWillReceiveProps(...args) {
    if (args[0].data instanceof Array && args[0].data.length > 0 && this.state.skuData.length === 0) {
      this.initData(args[0].data);
    }
  }
  getValue(callback) {
    const { form } = this.props;
    const skuList = [];
    form.validateFieldsAndScroll((err, fieldsSku) => {
      if (err) {
        return;
      }
      let count = 1;
      const keys = Object.keys(fieldsSku);
      while (Object.prototype.hasOwnProperty.call(fieldsSku, `r_${count}_virtualInventory`)) {
        const skuSingle = {};
        keys.forEach((key) => {
          if (key.match(`r_${count}_`) && fieldsSku[key]) {
            skuSingle[key.split(`r_${count}_`)[1]] = fieldsSku[key];
          }
        });
        skuList.push(skuSingle);
        count += 1;
      }
      if (skuList.length < 1) {
        message.error('请至少填写一项sku信息');
        return;
      }
      if (callback) callback(skuList);
    });
  }
  clearValue() {
    const { form } = this.props;
    this.setState({ skuData: [] }, () => {
      form.resetFields();
    });
  }
  initData(data) {
    data.forEach((el, index) => {
      el.key = index + 1;
    });
    this.setState({ skuData: data });
  }
  addItem() {
    const { skuData } = this.state;
    const skuLen = skuData.length;
    const lastId = skuLen < 1 ? 0 : skuData[skuData.length - 1].key;
    const newId = parseInt(lastId, 10) + 1;
    const newItem = {
      // id: newId,
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
  delItem(key) {
    console.log(key);
    const { skuData } = this.state;
    const newSkuData = skuData.filter(item => key !== item.key);
    this.setState({ skuData: newSkuData }, () => {
      setTimeout(() => {
        this.setState({ skuData: newSkuData.map((el, index) => { el.key = index + 1; return el; }) });
      }, 100);
    });
  }
  render() {
    const p = this;
    const { form, parent } = this.props;
    const { getFieldDecorator } = form;
    const { skuData } = this.state;

    // 注册props
    if (!parent.clearSkuValue) parent.clearSkuValue = this.clearValue.bind(this);
    if (!parent.getSkuValue) parent.getSkuValue = this.getValue.bind(this);

    const modalTableProps = {
      columns: [
        {
          title: '尺寸',
          dataIndex: 'scale',
          key: 'scale',
          width: '18%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_scale`, { initialValue: t || '' })(
                  <Input placeholder="请填写尺寸" />)}
                {getFieldDecorator(`r_${r.key}_id`, { initialValue: r.id || null })(
                  <Input style={{ display: 'none' }} />)}
              </FormItem>
            );
          },
        },
        {
          title: '颜色',
          dataIndex: 'color',
          key: 'color',
          width: '18%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_color`, { initialValue: t || '' })(
                  <Input placeholder="请填写颜色" />)}
              </FormItem>
            );
          },
        },
        {
          title: '虚拟库存',
          dataIndex: 'virtualInventory',
          key: 'virtualInventory',
          width: '18%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_virtualInventory`, { initialValue: t || '' })(
                  <InputNumber step={1} min={0} placeholder="请填写虚拟库存" />)}
              </FormItem>
            );
          },
        },
        {
          title: 'SKU条码',
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: '18%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_skuCode`, { initialValue: t || '' })(
                  <Input placeholder="请填写SKU条码" />)}
              </FormItem>
            );
          },
        },
        {
          title: '重量(KG)',
          dataIndex: 'weight',
          key: 'weight',
          width: '18%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_weight`, { initialValue: t || '' })(
                  <InputNumber step={0.01} min={0} placeholder="请填写重量" />)}
              </FormItem>
            );
          },
        },
        {
          title: '操作',
          key: 'operator',
          render(text, record) {
            return (
              <Popconfirm title="确定删除?" onConfirm={p.delItem.bind(p, record.key)}>
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
          rowKey={record => record.key}
          pagination={false}
        />
      </Row>
    );
  }
}

export default Form.create()(SkuTable);
