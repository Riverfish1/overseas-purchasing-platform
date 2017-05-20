import React, { Component } from 'react';
import { Form, Input, Modal, Row, Col, Alert, Table, Cascader } from 'antd';

import divisions from '../../../utils/divisions.json';
import check from '../../../utils/checkLib';

const FormItem = Form.Item;

class DeliveryModal extends Component {
  handleSubmit() {
    const p = this;
    const { form, dispatch, ids } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      if (values.address) {
        values.receiverState = values.address[0];
        values.receiverCity = values.address[1];
        values.receiverDistrict = values.address[2];
        delete values.address;
      }
      console.log(values);
      values.erpOrderId = JSON.stringify(ids);
      dispatch({
        type: 'order/multiDelivery',
        payload: { ...values },
        callback() {
          p.handleCancel();
        },
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

    const columns = [
      { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
      { title: '子订单号', dataIndex: 'erpNo', key: 'erpNo' },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName' },
      { title: '颜色', dataIndex: 'color', key: 'color' },
      { title: '尺寸', dataIndex: 'scale', key: 'scale' },
      { title: '数量', dataIndex: 'quantity', key: 'quantity' },
      { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName' },
    ];

    const initialAddress = [];
    initialAddress.push(data.receiverState);
    initialAddress.push(data.receiverCity);
    initialAddress.push(data.receiverDistrict);

    return (
      <div>
        <Modal
          visible={visible}
          title="批量发货"
          onOk={p.handleSubmit.bind(p)}
          onCancel={p.handleCancel.bind(p)}
          width={900}
        >
          <Form>
            {data.info && <Row>
              <Alert
                message={data.info}
                type="warning"
                closable
              />
              <div style={{ height: 10 }} />
            </Row>}
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
            </Row>
            <Row>
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
            </Row>
            <Row>
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
            <Row>
              <Table columns={columns} dataSource={data.erpOrderList || []} rowKey={r => r.erpNo} pagination={false} bordered />
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DeliveryModal);
