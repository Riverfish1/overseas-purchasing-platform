import React, { Component } from 'react';
import { Modal, Button, Input, InputNumber, Select, Row, Col, Table, Form } from 'antd';
import fetch from '../../utils/request';
import styles from './Purchase.less';

const FormItem = Form.Item;
const Option = Select.Option;

let firstLoad = true;

function toString(str, type) {
  if (typeof str !== 'undefined' && str !== null) {
    return str.toString();
  }
  if (type === 'SELECT') return undefined;
  return '';
}

function generateRandomSkuId(skuId) {
  return `${skuId && skuId.toString().split('__')[0]}__${new Date().getTime()}`;
}

function restoreSkuId(skuId) {
  return skuId && parseInt(skuId.toString().split('__')[0], 10);
}

function checkPassed(str) {
  if (typeof str === 'undefined' || str === '' || str === null) return false;
  return true;
}

class PurchaseModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      storageList: [],
      id: undefined,
    };
  }

  componentWillReceiveProps(...args) {
    const { purchaseStorageData, dispatch } = args[0];
    if (purchaseStorageData && purchaseStorageData.purchaseStorageDetailList && firstLoad) {
      this.setState({ storageList: purchaseStorageData.purchaseStorageDetailList, id: purchaseStorageData.id });
      dispatch({ type: 'purchaseStorage/queryBuyerTaskList', payload: { buyerId: purchaseStorageData.buyerId } });
      firstLoad = false;
    }
  }

  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  sendToRight() {
    const storageList = this.state.storageList;
    this.state.selectedRowKeys.forEach((key) => {
      const realKey = key.split('__')[0];
      const res = this.props.buyerTaskList.filter(el => el.skuId.toString() === realKey.toString());
      if (res.length > 0) storageList.push(res[0]);
    });
    this.setState({ storageList, selectedRowKeys: [] });
  }

  // sku拆分
  addRightList(skuId) {
    const { storageList } = this.state;
    let lastIndex = -1;
    storageList.forEach((el, index) => {
      if (el.skuId === skuId) lastIndex = index;
    });
    if (lastIndex >= 0) {
      const newIndex = lastIndex + 1;
      storageList.splice(newIndex, 0, { ...storageList[lastIndex] });
      storageList[newIndex].skuId = generateRandomSkuId(storageList[newIndex].skuId);
      storageList[newIndex].shelfNo = '';
      if (storageList[newIndex].id) delete storageList[newIndex].id;
    }
    this.setState({ storageList });
  }

  delRightList(skuId) {
    const storageList = this.state.storageList;
    this.setState({ storageList: storageList.filter(el => el.skuId !== skuId) || [] });
  }

  inputChange(type, skuId, value) {
    const storageList = this.state.storageList;
    storageList.forEach((el) => {
      if (el.skuId === skuId) {
        el[type] = typeof value !== 'object' ? value : value.target.value;
      }
    });
    this.setState({ storageList });
  }

  handleSave(type) {
    const p = this;
    const { form, dispatch } = p.props;
    // TODO: 上传的是skuid
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) { return; }
      const storageList = p.state.storageList;
      if (storageList.length < 1) {
        Modal.error({ title: '请至少添加一项SKU' });
        return;
      }

      let hasError = false;
      fieldsValue.purchaseStorageDetails = JSON.stringify(storageList.map((el) => {
        const item = {};
        item.skuId = restoreSkuId(el.skuId);
        if (el.id) item.id = el.id;

        if (!checkPassed(el.price) || !checkPassed(el.shelfNo)) {
          hasError = true;
          Modal.error({ title: '单价、货架号均为必填项' });
          return false;
        } else {
          if (!checkPassed(el.quantity) && !checkPassed(el.transQuantity)) {
            Modal.error({ title: '数量、在途数量请至少填写一项' });
            return false;
          }
          item.quantity = el.quantity || 0;
          item.transQuantity = el.transQuantity || 0;
          item.price = el.price;
          item.shelfNo = el.shelfNo;
          item.taskDailyDetailId = el.taskDetailId;
          item.taskDailyCount = el.count;
          return item;
        }
      }));

      if (!hasError) {
        fieldsValue.id = p.state.id;
        delete fieldsValue.stoOrderNo;
        if (type === 'save') {
          dispatch({
            type: fieldsValue.id ? 'purchaseStorage/saveStorage' : 'purchaseStorage/addStorage',
            payload: {
              fieldsValue,
              success() {
                p.closeModal();
              },
            },
          });
        } else {
          dispatch({
            type: 'purchaseStorage/confirmStorage',
            payload: {
              fieldsValue,
              success() {
                p.closeModal();
              },
            },
          });
        }
      }
    });
  }

  queryBuyerTaskList(buyerId) {
    this.setState({ selectedRowKeys: [] });
    this.props.dispatch({ type: 'purchaseStorage/queryBuyerTaskList', payload: { buyerId } });
  }

  closeModal() {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({ type: 'purchaseStorage/toggleShowModal' });
    dispatch({ type: 'purchaseStorage/clearEditInfo' });
    dispatch({ type: 'purchaseStorage/updateBuyerTaskList', payload: { data: [] } });
    this.setState({ selectedRowKeys: [], storageList: [] });
    firstLoad = true;
  }

  queryUpc() {
    const p = this;
    const dom = this.upcInput;
    const input = dom.refs.input;
    const value = input.value;
    if (value) {
      fetch.post('/haierp1/itemSku/queryBySkuCodeOrUpc', { data: { code: value } }).then((res) => {
        if (res.data && res.data.length > 0) {
          res.data[0].skuId = generateRandomSkuId(res.data[0].id);
          const { storageList } = p.state;
          storageList.push(res.data[0]);
          p.setState({ storageList });
          input.value = '';
        } else {
          Modal.info({
            title: '未查找到相关SKU',
            content: '请更换搜索关键词尝试',
          });
        }
      });
    }
  }

  render() {
    const p = this;
    const { form, title, visible, purchaseStorageData = {}, buyer = [], wareList = [], buyerTaskList = [] } = p.props;
    const { selectedRowKeys, storageList } = p.state;
    const { getFieldDecorator } = form;

    const modalProps = {
      visible,
      width: 1280,
      wrapClassName: 'modalStyle',
      okText: '保存',
      title,
      maskClosable: false,
      closable: true,
      footer: (
        <div>
          <Button type="ghost" size="large" onClick={p.closeModal.bind(p)}>取消</Button>
          <Button type="primary" size="large" onClick={p.handleSave.bind(p, 'confirm')}>确认入库</Button>
          <Button type="primary" size="large" onClick={p.handleSave.bind(p, 'save')}>保存入库单</Button>
        </div>
      ),
      onOk() {
        p.handleSubmit();
      },
      onCancel() {
        p.closeModal();
      },
    };

    const formItemLayout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };

    const columnsTaskList = [
      { title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 50 },
      { title: 'UPC', dataIndex: 'upc', key: 'upc', width: 50 },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 100 },
      { title: '图片', dataIndex: 'skuPic', key: 'skuPic', width: 100, render(t) { return t ? <img alt="" src={JSON.parse(t).picList[0].url} width="80" height="80" /> : '无'; } },
      { title: '颜色', dataIndex: 'color', key: 'color', width: 40 },
      { title: '规格', dataIndex: 'scale', key: 'scale', width: 44 },
      { title: '计划采购数', dataIndex: 'count', key: 'count', width: 60 },
      { title: '已入库数', dataIndex: 'inCount', key: 'inCount', width: 70, render(t) { return t || 0; } },
    ];

    const columnsStorageList = [
      { title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 70 },
      { title: 'UPC', dataIndex: 'upc', key: 'upc', width: 50 },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 100 },
      { title: '图片', dataIndex: 'skuPic', key: 'skuPic', width: 100, render(t) { return t ? <img alt="" src={JSON.parse(t).picList[0].url} width="100" height="100" /> : '无'; } },
      { title: '颜色', dataIndex: 'color', key: 'color', width: 50 },
      { title: '规格', dataIndex: 'scale', key: 'scale', width: 50 },
      { title: '已入库数', dataIndex: 'inCount', key: 'inCount', width: 70, render(t) { return t || 0; } },
      { title: '计划采购数', dataIndex: 'count', key: 'count', width: 60, render(t, r) { return t || r.taskDailyCount; } },
      { title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 70,
        render(t, r) {
          const quantity = r.count - r.inCount;
          return <InputNumber min={1} step="1" placeholder="输入" defaultValue={(quantity && quantity > 0) ? quantity : 0} onChange={p.inputChange.bind(p, 'quantity', r.skuId)} />;
        },
      },
      { title: '在途数量',
        dataIndex: 'transQuantity',
        key: 'transQuantity',
        width: 70,
        render(t, r) {
          return <InputNumber min={0} step="1" placeholder="输入" value={t} onChange={p.inputChange.bind(p, 'transQuantity', r.skuId)} />;
        },
      },
      { title: '单价',
        dataIndex: 'price',
        key: 'price',
        width: 90,
        render(t, r) {
          return <InputNumber min={0} step="0.01" placeholder="输入" value={t} onChange={p.inputChange.bind(p, 'price', r.skuId)} />;
        },
      },
      { title: '货架号',
        dataIndex: 'shelfNo',
        key: 'shelfNo',
        width: 80,
        render(t, r) {
          return <Input placeholder="输入" value={t} onChange={p.inputChange.bind(p, 'shelfNo', r.skuId)} />;
        },
      },
      { title: '操作',
        dataIndex: 'op',
        key: 'op',
        width: 70,
        render(t, r) {
          return (
            <span>
              <a href="javascript:void(0)" onClick={p.addRightList.bind(p, r.skuId)}>拆分</a>
              <a style={{ marginLeft: 5 }} href="javascript:void(0)" onClick={p.delRightList.bind(p, r.skuId)}>删除</a>
            </span>
          );
        },
      },
    ];

    const storageListMapKeys = storageList.map(el => parseInt(el.skuId.toString().split('__')[0], 10));

    const filteredBuyerTask = buyerTaskList ? buyerTaskList.filter(el => storageListMapKeys.indexOf(el.skuId) === -1) : [];

    return (
      <Modal {...modalProps}>
        <Form>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="入库单号"
                {...formItemLayout}
              >
                {getFieldDecorator('stoOrderNo', {
                  initialValue: toString(purchaseStorageData.stoOrderNo),
                })(
                  <Input placeholder="自动生成" disabled />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="选择买手"
                {...formItemLayout}
              >
                {getFieldDecorator('buyerId', {
                  initialValue: toString(purchaseStorageData.buyerId, 'SELECT'),
                  rules: [{ required: true, message: '请选择买手' }],
                })(
                  <Select placeholder="请选择买手" optionLabelProp="title" onChange={this.queryBuyerTaskList.bind(this)}>
                    {buyer.map(el => <Option key={el.id} title={el.name}>{el.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem
                label="仓库"
                {...formItemLayout}
              >
                {getFieldDecorator('warehouseId', {
                  initialValue: toString(purchaseStorageData.warehouseId, 'SELECT'),
                  rules: [{ required: true, message: '请选择仓库' }],
                })(
                  <Select placeholder="请选择仓库" optionLabelProp="title">
                    {wareList.map(el => <Option key={el.id} title={el.name}>{el.name}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="备注"
                {...formItemLayout}
              >
                {getFieldDecorator('remark', {
                  initialValue: toString(purchaseStorageData.remark),
                })(
                  <Input placeholder="请填写备注" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span="12">
              <div className={styles.blockTitle}>采购明细</div>
              <Row style={{ margin: '10px 0' }}>
                <Col><Button type="primary" size="large" style={{ float: 'right' }} onClick={this.sendToRight.bind(this)} disabled={selectedRowKeys.length < 1}>移到右边</Button></Col>
              </Row>
              <Table columns={columnsTaskList} bordered scroll={{ x: '130%', y: 500 }} dataSource={filteredBuyerTask} rowKey={r => `${r.skuId}__${r.taskDetailId}`} rowSelection={rowSelection} pagination={false} />
            </Col>
            <Col span="12">
              <div className={styles.blockTitle}>入库明细</div>
              <Row style={{ margin: '10px 0' }}>
                <Col span="12"><Input placeholder="输入SKU代码或UPC码添加" size="large" ref={(c) => { this.upcInput = c; }} /></Col>
                <Col span="6" style={{ marginLeft: 10 }}><Button type="primary" size="large" onClick={this.queryUpc.bind(this)}>添加</Button></Col>
              </Row>
              <Table columns={columnsStorageList} bordered scroll={{ x: '140%', y: 500 }} dataSource={storageList} rowKey={r => r.id} pagination={false} />
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(PurchaseModal);
