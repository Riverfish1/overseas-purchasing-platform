import React, { Component } from 'react';
import { Form, Input, Modal, Row, Col, Select, DatePicker } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class ReturnOrderModal extends Component {
  handleSubmit() {
    const p = this;
    const { form, dispatch, data, returnType } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      if (returnType === '新增') {
        const { orderNo, outerOrderId, erpNo } = data;
        const erpOrderId = data.id;
        dispatch({
          type: 'order/addReturnOrder',
          payload: { ...values, orderNo, outerOrderId, erpNo, erpOrderId },
          cb() { p.handleCancel(); },
        });
      } else {
        values.id = data.id;
        dispatch({
          type: 'order/updateReturnOrder',
          payload: { ...values },
          cb() { p.handleCancel(); },
        });
      }
    });
  }
  handleCancel() {
    const { form, close } = this.props;
    form.resetFields();
    close();
  }
  render() {
    const p = this;
    const { visible, form, data = {}, returnType } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    console.log(data);
    return (
      <div>
        <Modal
          visible={visible}
          title={returnType}
          onOk={p.handleSubmit.bind(p)}
          onCancel={p.handleCancel.bind(p)}
          width={900}
        >
          <Form>
            <Row>
              <Col span={12}>
                <FormItem
                  label="退单状态"
                  {...formItemLayout}
                >
                  {getFieldDecorator('status', {
                    initialValue: typeof data.status === 'number' ? data.status.toString : undefined,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择退单状态" allowClear disabled={returnType === '查看'}>
                      <Option value="0" key="0">退单中</Option>
                      <Option value="1" key="1">已退货</Option>
                      <Option value="2" key="2">已退款</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="退货数量"
                  {...formItemLayout}
                >
                  {getFieldDecorator('returnQuantity', {
                    initialValue: data.returnQuantity,
                  })(
                    <Input placeholder="请输入" disabled={returnType === '查看'} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="退款金额"
                  {...formItemLayout}
                >
                  {getFieldDecorator('returnPrice', {
                    initialValue: data.returnPrice,
                  })(
                    <Input placeholder="请输入" disabled={returnType === '查看'} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="是否国内退货"
                  {...formItemLayout}
                >
                  {getFieldDecorator('isGn', {
                    initialValue: typeof (data.isGn) === 'number' ? data.isGn.toString() : '1',
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择" allowClear disabled={returnType === '查看'}>
                      <Option value="1" key="1">是</Option>
                      <Option value="0" key="0">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="收货时间"
                  {...formItemLayout}
                >
                  {getFieldDecorator('receiveTime', {
                    initialValue: data.receiveTime,
                  })(
                    <DatePicker showTime disabled={returnType === '查看'} placeholder="请输入收货时间" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="是否入库"
                  {...formItemLayout}
                >
                  {getFieldDecorator('isCheckin', {
                    initialValue: typeof data.isCheckin === 'number' ? data.isCheckin.toString() : '1',
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择" allowClear disabled={returnType === '查看'}>
                      <Option value="1" key="1">是</Option>
                      <Option value="0" key="0">否</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="退款时间"
                  {...formItemLayout}
                >
                  {getFieldDecorator('returnPayTime', {
                    initialValue: data.returnPayTime,
                  })(
                    <DatePicker disabled={returnType === '查看'} placeholder="请输入退款时间" style={{ width: '100%' }} showTime />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="退单原因"
                  {...formItemLayout}
                >
                  {getFieldDecorator('returnReason', {
                    initialValue: data.returnReason,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择退单原因" disabled={returnType === '查看'} >
                      <Option value="发错货">发错货</Option>
                      <Option value="多发货">多发货</Option>
                      <Option value="质量问题">质量问题</Option>
                      <Option value="尺码问题">尺码问题</Option>
                      <Option value="其他">其他</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label="退单原因"
                  {...formItemLayout}
                >
                  {getFieldDecorator('returnReasonDetail', {
                    initialValue: data.returnReasonDetail,
                  })(
                    <Input disabled={returnType === '查看'} type="textarea" placeholder="请输入退单原因详情" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="备注"
                  {...formItemLayout}
                >
                  {getFieldDecorator('remark', {
                    initialValue: data.remark,
                  })(
                    <Input disabled={returnType === '查看'} type="textarea" placeholder="请输入备注详情" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ReturnOrderModal);
