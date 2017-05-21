import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Input, Select, Button } from 'antd';

import InvoiceModal from './component/InvoiceModal';

const FormItem = Form.Item;
const Option = Select.Option;


class ShippingOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: {}, // 修改的record
      type: 'update',
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.dispatch({
        type: 'order/queryShippingOrderList',
        payload: { ...values },
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
  render() {
    const p = this;
    const { shippingOrderList, form, dispatch } = p.props;
    const { getFieldDecorator, resetFields } = form;
    const { visible, data } = p.state;

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: '发货单号', dataIndex: 'shippingNo', key: 'shippingNo', render(text) { return text || '-'; } },
      { title: '物流订单号', dataIndex: 'logisticNo', key: 'logisticNo', render(text) { return text || '-'; } },
      { title: '物流公司名称', dataIndex: 'logisticCompany', key: 'logisticCompany', render(text) { return text || '-'; } },
      { title: '子订单号', dataIndex: 'erpNo', key: 'erpNo', render(text) { return text || '-'; } },
      { title: '运单状态',
        dataIndex: 'status',
        key: 'status',
        render(text) {
          switch (text) {
            case 0: return '新建';
            case 1: return '已发货';
            case 2: return '已收货';
            default: return '-';
          }
        },
      },
      { title: '收件人', dataIndex: 'receiver', key: 'receiver', render(text) { return text || '-'; } },
      { title: '联系电话', dataIndex: 'telephone', key: 'telephone', render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 200,
        render(text, r) {
          return (
            <div>
              <a href="javascript:void(0)" onClick={p.updateModal.bind(p, r)}>修改</a>
            </div>);
        },
      },
    ];
    return (
      <div>
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
                {getFieldDecorator('logisticCompany', {})(
                  <Input placeholder="请输入" />,
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
          <Row style={{ marginLeft: 13 }}>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={() => { resetFields(); }}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row style={{ marginTop: 20 }}>
          <Table columns={columns} dataSource={shippingOrderList} rowKey={r => r.id} bordered />
        </Row>
        <InvoiceModal
          visible={visible}
          data={data}
          closeModal={this.closeModal.bind(this)}
          dispatch={dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { shippingOrderList } = state.order;
  return { shippingOrderList };
}

export default connect(mapStateToProps)(Form.create()(ShippingOrder));
