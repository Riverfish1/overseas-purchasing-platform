import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Input, Select, Button, Modal, Popover } from 'antd';

import DeliveryModal from './component/DeliveryModal';
import ErpOrderModal from './ErpOrderModal';
import SplitOrder from './component/SplitOrder';

const FormItem = Form.Item;
const Option = Select.Option;

class ErpOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNotSelected: true,
      modalVisible: false,
      title: '',
      checkId: [], // 发货时传的ID
      needSplitId: '',
      deliveryModalVisible: false,
      type: 'add', // 发货的判断
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    // 清除多选
    this.setState({ checkId: [] }, () => {
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) return;
        this.props.dispatch({
          type: 'order/queryErpOrderList',
          payload: { ...fieldsValue, pageIndex: 1 },
        });
      });
    });
  }
  showDeliveryModal() { // 批量发货
    const p = this;
    // 请求信息
    this.props.dispatch({
      type: 'order/queryErpOrderDetail',
      payload: {
        erpOrderId: this.state.checkId,
        callback() {
          p.setState({ deliveryModalVisible: true, isNotSelected: true });
        },
      },
    });
  }
  closeErpOrder() { // 子订单关闭
    const p = this;
    const { dispatch } = this.props;
    Modal.confirm({
      title: '关闭',
      content: '确定要关闭吗？',
      onOk: () => {
        dispatch({
          type: 'order/closeErpOrder',
          payload: {
            orderIds: JSON.stringify(p.state.checkId),
            callback() {
              p.setState({ isNotSelected: true, checkId: [] }); // 取消选择 checkId
              dispatch({
                type: 'order/queryErpOrderList',
                payload: {},
              });
            },
          },
        });
      },
    });
  }
  showModal(id, e) {
    e.stopPropagation();
    const p = this;
    p.setState({
      modalVisible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({ type: 'order/queryErpOrder', payload: { id } });
    });
  }
  closeDeliveryModal() {
    this.props.dispatch({
      type: 'order/saveErpOrderDetail',
      payload: {},
    });
    this.setState({ deliveryModalVisible: false, checkId: [] }); // 取消选择 checkId
  }
  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
    this.props.dispatch({
      type: 'order/saveErpOrder',
      payload: {},
    });
  }
  render() {
    const p = this;
    const { erpOrderList, erpOrderTotal, erpOrderDetail, form, dispatch, agencyList = [], erpOrderValues = {}, deliveryCompanyList = [] } = p.props;
    console.log(erpOrderValues);
    const { getFieldDecorator, resetFields } = form;
    const { isNotSelected, deliveryModalVisible, checkId, type, modalVisible, title } = p.state;

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        console.log(selectedRowKeys);
        const listId = [];
        if (selectedRows.length) p.setState({ isNotSelected: false });
        else p.setState({ isNotSelected: true });
        selectedRows.forEach((el) => {
          listId.push(el.id);
        });
        p.setState({ checkId: listId });
      },
      selectedRowKeys: p.state.checkId,
    };
    const columns = [
      { title: '主订单号', dataIndex: 'orderNo', key: 'orderNo', width: 100 },
      { title: '子订单号', dataIndex: 'erpNo', key: 'erpNo', width: 150 },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 150 },
      { title: '图片',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: 80,
        render(text) {
          const picList = JSON.parse(text).picList;
          const t = picList.length ? JSON.parse(text).picList[0].url : '';
          return (
            t ? <Popover title={null} content={<img role="presentation" src={t} style={{ width: 400 }} />}>
              <img role="presentation" src={t} width={60} height={60} />
            </Popover> : '-'
          );
        },
      },
      { title: 'UPC', dataIndex: 'upc', key: 'upc', width: 100 },
      { title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 100 },
      { title: '外部订单号', dataIndex: 'targetNo', key: 'targetNo', width: 150, render(text) { return text || '-'; } },
      { title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        width: 50,
        render(text) {
          switch (text) {
            case 0: return '新建';
            case 1: return '确认';
            case 2: return '已发货';
            case -1: return '已关闭';
            default: return '-';
          }
        },
      },
      {
        title: '备货状态',
        dataIndex: 'stockStatus',
        key: 'stockStatus',
        width: 80,
        render(text) {
          switch (text) {
            case 0: return '未备货';
            case 1: return '部分备货';
            case 2: return '部分在途备货';
            case 3: return '全部在途备货';
            case 4: return '混合备货完成';
            case 9: return '已释放';
            case 10: return '已备货';
            default: return '-';
          }
        },
      },
      { title: '收件人', dataIndex: 'receiver', key: 'receiver', width: 50 },
      { title: '收件人地址',
        dataIndex: 'address',
        key: 'address',
        width: 200,
        render(text, r) {
          return <span>{r.receiverState ? `${r.receiverState} ${r.receiverCity} ${r.receiverDistrict} ${r.addressDetail}` : '-'}</span>;
        },
      },
      { title: '联系电话', dataIndex: 'telephone', key: 'telephone', width: 150 },
      { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 220 },
      { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 200 },
      { title: '备注', dataIndex: 'remark', key: 'remark', width: 100, render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 110,
        fixed: 'right',
        render(t, r) {
          return (
            <div>
              <SplitOrder dispatch={dispatch} record={r} />
              <a href="javascript:void(0)" onClick={p.showModal.bind(p, r.id)} >修改</a>
            </div>);
        },
      },
    ];
    const pagination = {
      total: erpOrderTotal,
      onChange(page) {
        dispatch({
          type: 'order/queryErpOrderList',
          payload: { pageIndex: page },
        });
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
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="子订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('erpNo', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="外部订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('targetNo', {})(
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="订单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option value="0">新建</Option>
                    <Option value="2">已发货</Option>
                    <Option value="-1">已关闭</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="备货状态"
                {...formItemLayout}
              >
                {getFieldDecorator('stockStatus', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option value="0">未备货</Option>
                    <Option value="1">部分备货</Option>
                    <Option value="2">部分在途备货</Option>
                    <Option value="3">全部在途备货</Option>
                    <Option value="4">混合备货完成</Option>
                    <Option value="9">已释放</Option>
                    <Option value="10">已备货</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="SKU代码"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('itemName', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="UPC"
                {...formItemLayout}
              >
                {getFieldDecorator('upc', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="收件人"
                {...formItemLayout}
              >
                {getFieldDecorator('receiver', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="销售人员"
                {...formItemLayout}
              >
                {getFieldDecorator('salesName', {})(
                  <Select placeholder="请选择销售" >
                    {agencyList.map((el) => {
                      return <Option key={el.id} value={el.name}>{el.name}</Option>;
                    })}
                  </Select>,
                )}
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
          <Col span={22} className="operBtn">
            <Button type="primary" disabled={isNotSelected} size="large" onClick={p.showDeliveryModal.bind(p)}>发货</Button>
          </Col>
          <Col span={2} className="operBtn">
            <Button type="primary" disabled={isNotSelected} size="large" onClick={p.closeErpOrder.bind(p)}>关闭</Button>
          </Col>
        </Row>
        <DeliveryModal visible={deliveryModalVisible} deliveryCompanyList={deliveryCompanyList} ids={checkId} data={erpOrderDetail} closeModal={this.closeDeliveryModal.bind(this)} dispatch={dispatch} type={type} />
        <Table columns={columns} rowSelection={rowSelection} dataSource={erpOrderList} rowKey={r => r.id} pagination={pagination} scroll={{ x: '130%' }} bordered />
        <ErpOrderModal
          visible={modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={erpOrderValues}
          agencyList={agencyList}
          title={title}
          dispatch={dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { erpOrderList, erpOrderTotal, erpOrderDetail, erpOrderValues, deliveryCompanyList } = state.order;
  const { list } = state.agency;
  return { erpOrderList, erpOrderTotal, erpOrderDetail, agencyList: list, erpOrderValues, deliveryCompanyList };
}

export default connect(mapStateToProps)(Form.create()(ErpOrder));
