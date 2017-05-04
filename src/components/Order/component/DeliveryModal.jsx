import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

class DeliveryModal extends Component {
  multiDelivery() {
    const { form, dispatch, ids } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      console.log(values);
      values.erpOrderId = JSON.stringify(ids);
      dispatch({
        type: 'order/multiDelivery',
        payload: { ...values },
      });
    });
  }
  handleCancel() {
    const { form, closeModal } = this.props;
    form.resetFields();
    closeModal();
  }
  render() {
    const p = this;
    const { visible, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    return (
      <div>
        <Modal
          visible={visible}
          title="批量发货"
          onOk={p.multiDelivery.bind(p)}
          onCancel={p.handleCancel.bind(p)}
        >
          <Form>
            <FormItem
              label="收件人"
              {...formItemLayout}
            >
              {getFieldDecorator('receiver', {
                rules: [{ required: true, message: '请输入收件人' }],
              })(
                <Input placeholder="请输入收件人" />)}
            </FormItem>
            <FormItem
              label="收件地址"
              {...formItemLayout}
            >
              {getFieldDecorator('address', {
                rules: [{ required: true, message: '请输入收件地址' }],
              })(
                <Input placeholder="请输入收件地址" />)}
            </FormItem>
            <FormItem
              label="联系电话"
              {...formItemLayout}
            >
              {getFieldDecorator('telephone', {
                rules: [{ required: true, message: '请输入联系电话' }],
              })(
                <Input placeholder="请输入联系电话" />)}
            </FormItem>
            <FormItem
              label="详细地址"
              {...formItemLayout}
            >
              {getFieldDecorator('addressDetail', {
                rules: [{ required: true, message: '请输入详细地址' }],
              })(
                <Input placeholder="请输入详细地址" />)}
            </FormItem>
            <FormItem
              label="邮编"
              {...formItemLayout}
            >
              {getFieldDecorator('postcode', {})(
                <Input placeholder="请输入邮编" />)}
            </FormItem>
            <FormItem
              label="备注"
              {...formItemLayout}
            >
              {getFieldDecorator('remarks', {})(
                <Input placeholder="请输入" />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DeliveryModal);
