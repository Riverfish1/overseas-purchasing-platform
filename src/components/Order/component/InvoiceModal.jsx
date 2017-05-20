import React, { Component } from 'react';
import { Form, Input, Modal, Row, Col, Cascader, Select } from 'antd';

import divisions from '../../../utils/divisions.json';
import check from '../../../utils/checkLib';

const FormItem = Form.Item;
const Option = Select.Option;

class InvoiceModal extends Component {
  handleSubmit() {
    const p = this;
    const { form, dispatch, data } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      if (values.address) {
        values.receiverState = values.address[0];
        values.receiverCity = values.address[1];
        values.receiverDistrict = values.address[2];
        delete values.address;
      }
      console.log(values);
      values.id = data.id;
      dispatch({
        type: 'order/updateShippingOrder',
        payload: { ...values },
        callback() { p.handleCancel(); },
      });
    });
  }
  handleCancel() {
    const { form, closeModal } = this.props;
    form.resetFields();
    closeModal();
  }
  checkPhone(rules, value, cb) {
    if (value && !check.phone(value)) cb('请输入正确的手机号码');
    cb();
  }
  checkIdCard(rules, value, cb) {
    if (!value) cb();
    else if (check.idcard(value)) cb();
    else cb(new Error('请填写正确的身份证号'));
  }
  render() {
    const p = this;
    const { visible, form, data } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    const initialAddress = [];
    initialAddress.push(data.receiverState);
    initialAddress.push(data.receiverCity);
    initialAddress.push(data.receiverDistrict);

    return (
      <div>
        <Modal
          visible={visible}
          title="修改"
          onOk={p.handleSubmit.bind(p)}
          onCancel={p.handleCancel.bind(p)}
          width={900}
        >
          <Form>
            <Row>
              <Col span={12}>
                <FormItem
                  label="收件人"
                  {...formItemLayout}
                >
                  {getFieldDecorator('receiver', {
                    initialValue: data.receiver,
                    rules: [{ required: true, message: '请输入收件人' }],
                  })(
                    <Input placeholder="请输入收件人" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="收件地址"
                  {...formItemLayout}
                >
                  {getFieldDecorator('address', {
                    initialValue: initialAddress,
                    rules: [{ required: true, message: '请输入收件地址' }],
                  })(
                    <Cascader options={divisions} placeholder="请选择" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="联系电话"
                  {...formItemLayout}
                >
                  {getFieldDecorator('telephone', {
                    initialValue: data.telephone,
                    rules: [{ validator: this.checkPhone.bind(this) }],
                  })(
                    <Input placeholder="请输入联系电话" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="详细地址"
                  {...formItemLayout}
                >
                  {getFieldDecorator('addressDetail', {
                    initialValue: data.addressDetail,
                    rules: [{ required: true, message: '请输入详细地址' }],
                  })(
                    <Input placeholder="请输入详细地址" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="物流运单号"
                  {...formItemLayout}
                >
                  {getFieldDecorator('logisticNo', {
                    initialValue: data.logisticNo,
                  })(
                    <Input placeholder="请输入物流运单号" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="物流公司名称"
                  {...formItemLayout}
                >
                  {getFieldDecorator('LogisticCompany', {
                    initialValue: data.LogisticCompany,
                  })(
                    <Input placeholder="请输入物流公司名称" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="运单状态"
                  {...formItemLayout}
                >
                  {getFieldDecorator('status', {
                    initialValue: data.status,
                  })(
                    <Select placeholder="请选择运单状态" >
                      <Option value={0} key="0">新建</Option>
                      <Option value={1} key="1">已发货</Option>
                      <Option value={2} key="2">已收货</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="运费"
                  {...formItemLayout}
                >
                  {getFieldDecorator('freight', {
                    initialValue: data.freight,
                  })(
                    <Input placeholder="请输入运费" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="邮编"
                  {...formItemLayout}
                >
                  {getFieldDecorator('postcode', {
                    initialValue: data.postcode,
                  })(
                    <Input placeholder="请输入邮编" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="身份证号"
                  {...formItemLayout}
                >
                  {getFieldDecorator('idCard', {
                    initialValue: data.idCard,
                    rules: [{ validator: this.checkIdCard.bind(this) }],
                  })(
                    <Input placeholder="请输入身份证号" />)}
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
                    <Input placeholder="请输入备注" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(InvoiceModal);
