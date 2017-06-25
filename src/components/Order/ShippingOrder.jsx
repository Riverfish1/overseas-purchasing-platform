import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Input, Select, Button, Modal, Popover, DatePicker, message } from 'antd';

import InvoiceModal from './component/InvoiceModal';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

@window.regStateCache
class ShippingOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: {}, // 修改的record
      type: 'update',
      checkId: [],
      shippingDetail: [],
      showDetail: false,
    };
  }
  handleSubmit(e, page) {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (values.orderTime && values.orderTime[0] && values.orderTime[1]) {
        values.startOrderTime = new Date(values.orderTime[0]).format('yyyy-MM-dd');
        values.endOrderTime = new Date(values.orderTime[1]).format('yyyy-MM-dd');
      }
      delete values.orderTime;
      this.props.dispatch({
        type: 'order/queryShippingOrderList',
        payload: { ...values, pageIndex: typeof page === 'number' ? page : 1 },
      });
    });
  }
  updateModal(r) { // 修改发货单
    this.setState({ visible: true, data: r });
  }
  closeModal() {
    this.props.dispatch({
      type: 'order/saveErpOrderDetail',
      payload: {},
    });
    this.setState({ visible: false });
  }
  exportPdf() { // 导出发货标签
    const { checkId } = this.state;
    this.props.dispatch({
      type: 'order/exportPdf',
      payload: JSON.stringify(checkId),
    });
    this.setState({ checkId: [] });
  }
  queryDetail(r) { // 查看明细
    const p = this;
    this.props.dispatch({
      type: 'order/queryDetail',
      payload: { shippingOrderId: r.id },
      cb(data) {
        p.setState({
          shippingDetail: data,
          showDetail: true,
        });
      },
    });
  }
  exportOrderDetail() { // 导出发货明细
    const { form } = this.props;
    const p = this;
    form.validateFields((err, values) => {
      if (err) return;
      let startOrderTime;
      let endOrderTime;
      if (values.orderTime && values.orderTime[0] && values.orderTime[1]) {
        startOrderTime = new Date(values.orderTime[0]).format('yyyy-MM-dd');
        endOrderTime = new Date(values.orderTime[1]).format('yyyy-MM-dd');
        p.props.dispatch({
          type: 'order/exportOrderDetail',
          payload: {
            startOrderTime,
            endOrderTime,
          },
        });
      } else {
        message.error('请选择发货时间');
      }
    });
  }
  render() {
    const p = this;
    const { shippingOrderList, shippingOrderTotal, deliveryCompanyList = [], form, dispatch } = p.props;
    const { getFieldDecorator, resetFields } = form;
    const { visible, data, shippingDetail, showDetail } = p.state;

    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        const listId = [];
        selectedRows.forEach((el) => {
          listId.push(el.id);
        });
        p.setState({ checkId: listId });
      },
      selectedRowKeys: p.state.checkId,
    };

    const pagination = {
      pageSize: 20,
      total: shippingOrderTotal,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
      },
    };

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: '发货单号', dataIndex: 'shippingNo', key: 'shippingNo', width: 120, render(text) { return text || '-'; } },
      { title: '物流订单号', dataIndex: 'logisticNo', key: 'logisticNo', width: 100, render(text) { return text || '-'; } },
      { title: '物流公司名称', dataIndex: 'logisticCompany', width: 100, key: 'logisticCompany', render(text) { return text || '-'; } },
      { title: '子订单号', dataIndex: 'erpNo', key: 'erpNo', width: 200, render(text) { return text || '-'; } },
      { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 200, render(text) { return text || '-'; } },
      { title: '运单状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render(text) {
          switch (text) {
            case 0: return '新建';
            case 1: return '已发货';
            case 2: return '已收货';
            default: return '-';
          }
        },
      },
      { title: '收件人', dataIndex: 'receiver', key: 'receiver', width: 80, render(text) { return text || '-'; } },
      { title: '联系电话', dataIndex: 'telephone', key: 'telephone', width: 80, render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 80,
        render(text, r) {
          return (
            <div>
              <a href="javascript:void(0)" onClick={p.queryDetail.bind(p, r)} style={{ marginRight: 10 }}>查看</a>
              <a href="javascript:void(0)" onClick={p.updateModal.bind(p, r)} style={{ marginRight: 10 }}>修改</a>
            </div>);
        },
      },
    ];
    const detailColumns = [
      { title: '子订单号', dataIndex: 'erpNo', key: 'erpNo', width: 100 },
      { title: 'SKU编号', dataIndex: 'skuCode', key: 'skuCode', width: 200 },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 150 },
      { title: '商品图片',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: 100,
        render(t) {
          if (t) {
            const picObj = JSON.parse(t);
            const picList = picObj.picList;
            if (picList.length) {
              const imgUrl = picList[0].url;
              return (
                <Popover title={null} content={<img role="presentation" src={imgUrl} style={{ width: 400 }} />}>
                  <img role="presentation" src={imgUrl} width={60} height={60} />
                </Popover>
              );
            }
          }
          return '-';
        },
      },
      { title: '物流方式',
        dataIndex: 'logisticType',
        key: 'logisticType',
        width: 60,
        render(t) {
          switch (t) {
            case 0: return '直邮';
            case 1: return '拼邮';
            default: return '-';
          }
        },
      },
      { title: '颜色', dataIndex: 'color', key: 'color', width: 100 },
      { title: '尺码', dataIndex: 'scale', key: 'scale', width: 100 },
      { title: '购买数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
      { title: '发货仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
      { title: '配货库位', dataIndex: 'positionNo', key: 'positionNo', width: 100 },
    ];

    const isNotSelected = this.state.checkId.length === 0;

    return (
      <div>
        <div className="refresh-btn"><Button type="ghost" size="small" onClick={this._refreshData.bind(this)}>刷新</Button></div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="运单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option value="0">新建</Option>
                    <Option value="1">已发货</Option>
                    <Option value="2">已收货</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="物流公司名称"
                {...formItemLayout}
              >
                {getFieldDecorator('logisticCompany', {
                  rules: [{ required: true, message: '请选择物流公司名称' }],
                })(
                  <Select placeholder="请选择物流公司名称" allowClear>
                    {deliveryCompanyList.map(v => (
                      <Option value={v.name} key={v.name}>{v.name}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="物流订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('logisticNo', {})(
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
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
                label="收件人"
                {...formItemLayout}
              >
                {getFieldDecorator('receiver', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="电话"
                {...formItemLayout}
              >
                {getFieldDecorator('telephone', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="发货时间"
                {...formItemLayout}
                labelCol={{ span: 2 }}
              >
                {getFieldDecorator('orderTime', {})(
                  <RangePicker />,
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
        <Row className="operBtn">
          <Col>
            <Button type="primary" style={{ float: 'left' }} disabled={isNotSelected} size="large" onClick={this.exportPdf.bind(this)}>导出发货标签</Button>
            <Button type="primary" style={{ float: 'right' }} size="large" onClick={this.exportOrderDetail.bind(this)}>导出发货明细</Button>
          </Col>
        </Row>
        <Row>
          <Table columns={columns} dataSource={shippingOrderList} rowKey={r => r.id} rowSelection={rowSelection} pagination={pagination} bordered />
        </Row>
        <Modal
          visible={showDetail}
          title="详情"
          footer={null}
          width="900"
          onCancel={() => this.setState({ showDetail: false })}
        >
          <Table columns={detailColumns} dataSource={shippingDetail} rowKey={r => r.id} bordered />
        </Modal>
        <InvoiceModal
          visible={visible}
          data={data}
          deliveryCompanyList={deliveryCompanyList}
          closeModal={this.closeModal.bind(this)}
          dispatch={dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { shippingOrderList, deliveryCompanyList, shippingOrderTotal } = state.order;
  return { shippingOrderList, deliveryCompanyList, shippingOrderTotal };
}

export default connect(mapStateToProps)(Form.create()(ShippingOrder));
