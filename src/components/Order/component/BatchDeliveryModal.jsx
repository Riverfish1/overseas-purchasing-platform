import React, { Component } from 'react';
import { Form, Input, Modal, Row, Col, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class BatchDeliveryModal extends Component {
  handleSubmit() {
    const p = this;
    const { form, dispatch, checkId, submit } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      values.erpOrderId = JSON.stringify(checkId);
      dispatch({
        type: 'order/batchDelivery',
        payload: { ...values },
        callback() {
          p.handleCancel();
          submit();
        },
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
    const { visible, form, deliveryCompanyList } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <div>
        <Modal
          visible={visible}
          title={<font color="#00f" size="4">批量发货(每个子订单作为一个包裹)</font>}
          onOk={p.handleSubmit.bind(p)}
          onCancel={p.handleCancel.bind(p)}
          width={900}
        >
          <Form>
            <Row>
              <Col span={12}>
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
              <Col span={12}>
                <FormItem
                  label="运单状态"
                  {...formItemLayout}
                >
                  {getFieldDecorator('status')(
                    <Select placeholder="请选择运单状态" allowClear>
                      <Option value="0" key="0">新建</Option>
                      <Option value="1" key="1">已发货</Option>
                      <Option value="2" key="2">已收货</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="渠道"
                  {...formItemLayout}
                >
                  {getFieldDecorator('type', {
                    rules: [{ required: true, message: '请选择渠道' }],
                  })(
                    <Select placeholder="请选择渠道" allowClear>
                      <Option value="1" key="1">包税线</Option>
                      <Option value="2" key="2">身份证线</Option>
                      <Option value="3" key="3">BC线</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="运费"
                  {...formItemLayout}
                >
                  {getFieldDecorator('freight')(
                    <Input placeholder="请输入运费" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(BatchDeliveryModal);
