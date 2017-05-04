import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;


class ShippingOrder extends Component {
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
  render() {
    const p = this;
    const { shippingOrderList, form } = p.props;
    const { getFieldDecorator, resetFields } = form;

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: '发货单号', dataIndex: 'shippingNo', key: 'shippingNo', render(text) { return text || '-'; } },
      { title: '物流订单号', dataIndex: 'logisticNo', key: 'logisticNo', render(text) { return text || '-'; } },
      { title: '物流公司名称', dataIndex: 'logisticCompany', key: 'logisticCompany', render(text) { return text || '-'; } },
      { title: 'erp订单编号', dataIndex: 'erpNo', key: 'erpNo', render(text) { return text || '-'; } },
      { title: '运单状态',
        dataIndex: 'status',
        key: 'status',
        render(text) {
          switch (text) {
            case 0: return '未发货';
            case 3: return '已发货';
            case -1: return '已关闭';
            default: return '-';
          }
        },
      },
      { title: '收件人', dataIndex: 'receiver', key: 'receiver', render(text) { return text || '-'; } },
      { title: '联系电话', dataIndex: 'telephone', key: 'telephone', render(text) { return text || '-'; } },
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
                    <Option value="0">未发货</Option>
                    <Option value="3">已发货</Option>
                    <Option value="-1">已关闭</Option>
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { shippingOrderList } = state.order;
  return { shippingOrderList };
}

export default connect(mapStateToProps)(Form.create()(ShippingOrder));
