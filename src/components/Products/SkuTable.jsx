import React, { Component } from 'react';
import { Row, Col, Form, Table, Input, InputNumber, Button, Popconfirm, Cascader, message, Popover, Checkbox, Select } from 'antd';

import styles from './Products.less';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

function getScaleOptions(batchSkuSort, scaleTypes) {
  const filteredBatchOptions = scaleTypes.filter((el) => {
    el.id = el.id.toString();
    return el.id === batchSkuSort.toString();
  });

  const targetBatchOptions = filteredBatchOptions.length > 0 ? filteredBatchOptions[0].scaleList : [];

  const scaleOptions = targetBatchOptions.map((el) => {
    el.label = el.name.toString();
    el.value = el.name.toString();
    return el;
  });

  return scaleOptions;
}

class SkuTable extends Component {
  constructor() {
    super();
    this.state = { skuData: [], batchSkuAddVisible: false, batchSkuSort: '', batchSelected: [] };
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
      while (Object.prototype.hasOwnProperty.call(fieldsSku, `r_${count}_virtualInv`)) {
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
  addItem(scale) {
    const { skuData } = this.state;
    const skuLen = skuData.length;
    const lastId = skuLen < 1 ? 0 : skuData[skuData.length - 1].key;
    const newId = parseInt(lastId, 10) + 1;
    const newItem = {
      // id: newId,
      key: newId,
      scale: scale || '',
      color: '',
      virtualInv: '',
      packageLevelId: '',
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
  handleBatchSkuAddVisible(batchSkuAddVisible) {
    if (!batchSkuAddVisible) {
      const { batchSelected } = this.state;
      batchSelected.forEach((el) => {
        this.addItem(el);
      });
      this.setState({ batchSkuSort: '', batchSelected: [] });
    }
    this.setState({ batchSkuAddVisible });
  }
  changeBatchSkuType(type) {
    this.setState({ batchSkuSort: type });
    if (type) {
      this.setState({ batchSelected: getScaleOptions(type, this.props.scaleTypes).map(el => el.name) });
    }
  }
  handleBatchSelect(batchSelected) {
    this.setState({ batchSelected });
  }
  render() {
    const p = this;
    const { form, parent, packageScales, scaleTypes } = this.props;
    const { getFieldDecorator } = form;
    const { skuData, batchSkuSort, batchSelected } = this.state;

    // 注册props
    if (!parent.clearSkuValue) parent.clearSkuValue = this.clearValue.bind(this);
    if (!parent.getSkuValue) parent.getSkuValue = this.getValue.bind(this);

    const modalTableProps = {
      columns: [
        {
          title: '尺寸',
          dataIndex: 'scale',
          key: 'scale',
          width: '14%',
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
          width: '14%',
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
          dataIndex: 'virtualInv',
          key: 'virtualInv',
          width: '16%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_virtualInv`, { initialValue: t || '' })(
                  <InputNumber step={1} min={0} placeholder="请填写虚拟库存" />)}
              </FormItem>
            );
          },
        },
        {
          title: 'SKU条码',
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: '14%',
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
          width: '14%',
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
          title: '包装规格',
          dataIndex: 'packageLevelId',
          key: 'packageLevelId',
          width: '20%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_packageLevelId`, { initialValue: t || '' })(
                  <Cascader options={packageScales} placeholder="请选择包装规格" />)}
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

    const scaleOptions = getScaleOptions(batchSkuSort, scaleTypes);

    const BatchSkuAdd = (
      <div style={{ width: 400 }}>
        <Select placeholder="请选择类型" value={batchSkuSort || undefined} style={{ width: 200, marginTop: 10 }} onChange={this.changeBatchSkuType.bind(this)}>
          {scaleTypes.map(el => <Option key={el.id} value={el.id}>{el.type}</Option>)}
        </Select>
        {scaleOptions.length > 0 && <div style={{ height: 10 }} />}
        <CheckboxGroup options={scaleOptions} value={batchSelected} onChange={this.handleBatchSelect.bind(this)} />
        <div style={{ height: 20 }} />
        <Button type="primary" size="small" onClick={this.handleBatchSkuAddVisible.bind(this, false)}>添加</Button>
        <Button style={{ marginLeft: 10 }} size="small" onClick={this.handleBatchSkuAddVisible.bind(this, false)}>关闭</Button>
      </div>
    );

    return (
      <Row>
        <Col className={styles.productModalBtn}>
          <Button type="primary" onClick={this.addItem.bind(this)}>新增SKU</Button>
          <Popover
            content={BatchSkuAdd}
            title="选择分类"
            trigger="click"
            visible={this.state.batchSkuAddVisible}
          >
            <Button type="ghost" style={{ marginLeft: 10 }} onClick={this.handleBatchSkuAddVisible.bind(this, true)}>批量新增SKU</Button>
          </Popover>
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
