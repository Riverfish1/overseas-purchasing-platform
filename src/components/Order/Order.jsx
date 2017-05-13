import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, DatePicker, Button, Row, Col, Select, Form, Modal, Popconfirm } from 'antd';
import OrderModal from './OrderModal';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Order extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      visible: false,
      title: '', // modal的title
      checkId: [], // 审核时传的id
      isNotSelected: true,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (fieldsValue.orderTime) {
        fieldsValue.startOrderTime = new Date(fieldsValue.orderTime[0]).format('yyyy-MM-dd');
        fieldsValue.endOrderTime = new Date(fieldsValue.orderTime[1]).format('yyyy-MM-dd');
        delete fieldsValue.orderTime;
      }
      delete fieldsValue.action;
      this.props.dispatch({
        type: 'order/queryOrderList',
        payload: { ...fieldsValue, pageIndex: 1 },
      });
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
      title: '新增',
    });
    this.props.dispatch({
      type: 'sku/querySkuList',
      payload: {},
    });
  }

  handleOrderAction(type) {
    const { dispatch } = this.props;
    const { checkId } = this.state;
    switch (type) {
      case 'confirm': dispatch({ type: 'order/confirmOrder', payload: { orderIds: JSON.stringify(checkId) } }); break;
      case 'close': dispatch({ type: 'order/closeOrder', payload: { orderIds: JSON.stringify(checkId) } }); break;
      default: return false;
    }
  }

  updateModal(id, e) {
    e.stopPropagation();
    const p = this;
    p.setState({
      modalVisible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({ type: 'order/queryOrder', payload: { id } });
      p.props.dispatch({ type: 'sku/querySkuList', payload: {} });
    });
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
    this.props.dispatch({
      type: 'order/saveOrder',
      payload: {},
    });
  }

  handleProDetail(record) {
    const p = this;
    p.setState({
      visible: true,
    }, () => {
      p.props.dispatch({
        type: 'order/queryOrder',
        payload: { id: record.id, type: 'snip' },
      });
    });
  }

  handleDelete(id) {
    this.props.dispatch({
      type: 'order/deleteOrder',
      payload: { id },
    });
  }

  render() {
    const p = this;
    const { form, orderList = [], orderTotal, currentPage, orderValues = {}, orderSkuSnip = {}, salesName = [], agencyList = [] } = p.props;
    const { getFieldDecorator, getFieldsValue, resetFields } = form;
    const { title, visible, isNotSelected } = p.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columnsList = [
      { title: '主订单号', dataIndex: 'orderNo', key: 'orderNo', width: 100 },
      { title: '外部订单号', dataIndex: 'targetNo', key: 'targetNo', width: 200, render(text) { return text || '-'; } },
      { title: '客户', dataIndex: 'salesName', key: 'salesName', width: 50, render(text) { return text || '-'; } },
      { title: '订单时间', dataIndex: 'orderTime', key: 'orderTime', width: 200, render(text) { return text || '-'; } },
      { title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        width: 50,
        render(text) {
          switch (text) {
            case 0: return '新建';
            case 1: return '已确定';
            case -1: return '已关闭';
            default: return '-';
          }
        },
      },
      { title: '收件人', dataIndex: 'receiver', key: 'receiver', width: 60 },
      { title: '收件人地址',
        dataIndex: 'address',
        key: 'address',
        width: 200,
        render(t, r) {
          return <span>{`${r.receiverState} ${r.receiverCity} ${r.receiverDistrict} ${r.addressDetail}`}</span>;
        },
      },
      { title: '联系电话', dataIndex: 'telephone', key: 'telephone', width: 200 },
      { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 200 },
      { title: '备注', dataIndex: 'remark', key: 'remark', width: 100, render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 200,
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" onClick={p.handleProDetail.bind(p, record)}>订单明细</a>
              <a href="javascript:void(0)" style={{ margin: '0 10px' }} onClick={p.updateModal.bind(p, record.id)}>修改</a>
              <Popconfirm title="确定删除此订单？" onConfirm={p.handleDelete.bind(p, record.id)}>
                <a href="javascript:void(0)" style={{ marginRight: '10px' }}>删除</a>
              </Popconfirm>
            </div>);
        },
      },
    ];

    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        const listId = [];
        if (selectedRows.length) p.setState({ isNotSelected: false });
        else p.setState({ isNotSelected: true });
        selectedRows.forEach((el) => {
          listId.push(el.id);
        });
        p.setState({ checkId: listId });
      },
    };

    const listPaginationProps = {
      total: orderTotal,
      current: currentPage,
      pageSize: 10,
      onChange(page) {
        const values = getFieldsValue();
        const payload = {};
        Object.keys(values).forEach((key) => {
          if (values[key]) {
            payload[key] = values[key];
          }
        });
        p.props.dispatch({
          type: 'order/queryOrderList',
          payload: { ...payload, pageIndex: page },
        });
      },
    };

    const skuColumns = [
      {
        title: '商品SKU',
        dataIndex: 'skuCode',
        key: 'skuCode',
        render(text) { return text || '-'; },
      },
      {
        title: '颜色',
        dataIndex: 'color',
        key: 'color',
        render(text) { return text || '-'; },
      },
      {
        title: '尺码',
        dataIndex: 'scale',
        key: 'scale',
        render(text) { return text || '-'; },
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        render(text) { return text || '-'; },
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        render(text) { return text || '-'; },
      },
      {
        title: '运费',
        dataIndex: 'freight',
        key: '10',
        render(text) { return text || '-'; },
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        key: '11',
        render(text) { return text || '-'; },
      },
      {
        title: '商品名称',
        dataIndex: 'itemName',
        key: 'itemName',
        render(text) { return text || '-'; },
      },
    ];

    const modalProps = {
      title: `订单编号：${(orderSkuSnip.data && orderSkuSnip.data.orderNo) || '-'}`,
      footer: null,
      visible,
      width: 1200,
      closable: true,
      onCancel() {
        p.setState({ visible: false });
        p.props.dispatch({ type: 'order/saveOrderSkuSnip', payload: {} });
      },
    };

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="主订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('orderNo', {})(
                  <Input placeholder="请输入主订单号" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="外部订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('targetNo', {})(
                  <Input placeholder="请输入外部订单号" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="订单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {
                  initialValue: '0',
                })(
                  <Select placeholder="请选择订单状态">
                    <Option value="10">全部</Option>
                    <Option value="0">新建</Option>
                    <Option value="1">已确定</Option>
                    <Option value="-1">已关闭</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="收件人"
                {...formItemLayout}
              >
                {getFieldDecorator('receiver', {})(
                  <Input placeholder="请输入收件人" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="联系电话"
                {...formItemLayout}
              >
                {getFieldDecorator('telephone', {})(
                  <Input placeholder="请输入联系电话" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="客户"
                {...formItemLayout}
              >
                {getFieldDecorator('salesName', {})(
                  <Input placeholder="请输入客户名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col style={{ marginLeft: 6 }}>
              <FormItem
                label="订单时间范围"
                labelCol={{ span: 3 }}
              >
                {getFieldDecorator('orderTime', {})(<RangePicker />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginLeft: 13 }}>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={() => { resetFields(); }}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col className="operBtn" span={20}>
            <Button type="primary" size="large" onClick={p.showModal.bind(p)}>新增订单</Button>
          </Col>
          <Col className="operBtn" span={2}>
            <Button type="primary" disabled={isNotSelected} size="large" onClick={p.handleOrderAction.bind(p, 'confirm')}>订单确定</Button>
          </Col>
          <Col className="operBtn" span={2}>
            <Button type="primary" disabled={isNotSelected} size="large" onClick={p.handleOrderAction.bind(p, 'close')}>订单关闭</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columnsList}
              dataSource={orderList}
              bordered
              size="large"
              rowKey={record => record.id}
              pagination={listPaginationProps}
              rowSelection={rowSelection}
            />
          </Col>
        </Row>
        <Modal {...modalProps}>
          <Table
            columns={skuColumns}
            dataSource={orderSkuSnip.data && orderSkuSnip.data.outerOrderDetails}
            bordered
            size="large"
            rowKey={record => record.id}
            pagination={false}
            scroll={{ x: '130%' }}
          />
        </Modal>
        <OrderModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={orderValues}
          agencyList={agencyList}
          salesName={salesName}
          title={title}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { orderList, orderTotal, currentPage, orderValues, orderSkuSnip, salesName } = state.order;
  const { list } = state.agency;
  return {
    orderList,
    orderTotal,
    currentPage,
    orderValues,
    orderSkuSnip,
    salesName,
    agencyList: list,
  };
}

const OrderList = Form.create()(Order);

export default connect(mapStateToProps)(OrderList);
