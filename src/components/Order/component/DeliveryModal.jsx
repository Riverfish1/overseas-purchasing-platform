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
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    return (
      <div>
        <Modal
          visible={visible}
          title="批量返货"
          onOk={p.multiDelivery.bind(p)}
          onCancel={p.handleCancel.bind(p)}
        >
          <Form>
            <FormItem
              label="收件人"
              {...formItemLayout}
            >
              {getFieldDecorator('receiver', {})(
                <Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="收件地址"
              {...formItemLayout}
            >
              {getFieldDecorator('address', {})(
                <Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="联系电话"
              {...formItemLayout}
            >
              {getFieldDecorator('telephone', {})(
                <Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="邮编"
              {...formItemLayout}
            >
              {getFieldDecorator('postcode', {})(
                <Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              label="详细地址"
              {...formItemLayout}
            >
              {getFieldDecorator('addressDetail', {})(
                <Input placeholder="请输入" />)}
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
