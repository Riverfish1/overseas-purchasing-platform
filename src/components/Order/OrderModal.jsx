import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Cascader, Input, Row, Col, DatePicker, Form, Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ProductTable from './ProductTable';
import divisions from '../../utils/divisions.json';
import * as check from '../../utils/checkLib';

moment.locale('zh-cn');

const Option = Select.Option;
const FormItem = Form.Item;

class ProductsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
    };

    // skuTable改写父级方法
    this.getSkuValue = null;
    this.clearSkuValue = null;
  }

  handleSubmit() {
    const p = this;
    const { form, dispatch, modalValues } = p.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) { return; }
      p.getSkuValue((orderDetailList) => {
        if (modalValues && modalValues.data) {
          dispatch({
            type: 'order/updateOrder',
            payload: { ...fieldsValue, id: modalValues.data.id, outerOrderDetailList: JSON.stringify(orderDetailList) },
          });
        } else {
          dispatch({
            type: 'order/addOrder',
            payload: { ...fieldsValue, outerOrderDetailList: JSON.stringify(orderDetailList) },
          });
        }
        p.closeModal();
      });
    });
  }

  closeModal() {
    const { form, close } = this.props;
    form.resetFields();
    close(false);
    // 清理skuTable
    setTimeout(() => {
      this.clearSkuValue();
    }, 100);
  }

  handleCancel() {
    this.setState({ previewVisible: false });
  }

  checkPhone(rules, value, callback) {
    if (check.phone(value) || check.tel(value)) {
      callback();
    } else {
      callback(new Error('请填写正确的手机或座机'));
    }
  }

  checkIdCard(rules, value, callback) {
    if (!value) callback();
    else if (check.idcard(value)) {
      callback();
    } else {
      callback(new Error('请填写正确的身份证号'));
    }
  }

  checkName(rules, value, callback) {
    if (check.ChineseName(value, { min: 2 })) {
      callback();
    } else {
      callback(new Error('请填写正确的姓名'));
    }
  }

  checkImg(rules, values, callback) {
    callback();
  }

  // queryItemSkus(param) {
  //   const { modalValues = {} } = this.props;
  //   modalValues.data && modalValues.data.itemSkus.map(item => {
  //     return item[param];
  //   });
  // }

  handleDelete(id) {
    const { skuList } = this.state;
    const skuData = skuList.filter(item => id !== item.id);
    this.setState({ skuList: skuData });
  }

  render() {
    const p = this;
    const { form, title, visible, modalValues = {}, agencyList = [] } = p.props;
    const orderData = (modalValues && modalValues.data) || {};
    const { getFieldDecorator } = form;
    const modalProps = {
      visible,
      width: 900,
      wrapClassName: 'modalStyle',
      okText: '保存',
      title,
      maskClosable: false,
      closable: true,
      onOk() {
        p.handleSubmit();
      },
      onCancel() {
        p.closeModal();
      },
    };
    const formItemLayout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    };

    return (
      <Modal {...modalProps} >
        <Form onSubmit={p.handleSubmit.bind(p)}>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="订单编号"
                {...formItemLayout}
              >
                {getFieldDecorator('orderNo', {
                  initialValue: orderData.orderNo,
                })(
                  <Input placeholder={!orderData.orderNo && '自动生成'} disabled />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="销售"
                {...formItemLayout}
              >
                {getFieldDecorator('salesName', {
                  initialValue: orderData.salesName || undefined,
                  rules: [{ required: true, message: '请选择销售' }],
                })(
                  <Select placeholder="请选择销售" >
                    {agencyList.map(el => <Option key={el.id} value={el.userName}>{el.userName}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="订单时间"
                {...formItemLayout}
              >
                {getFieldDecorator('orderTime', {
                  initialValue: (orderData.orderTime && moment(orderData.orderTime, 'YYYY-MM-DD')) || moment(new Date(), 'YYYY-MM-DD'),
                  rules: [{ required: true, message: '请输入订单时间' }],
                })(
                  <DatePicker format="YYYY-MM-DD" placeholder="请输入订单时间" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="收件人"
                {...formItemLayout}
              >
                {getFieldDecorator('receiver', {
                  initialValue: orderData.receiver,
                  rules: [{ required: true, validator: this.checkName.bind(this), message: '请输入收件人中文名' }],
                })(
                  <Input placeholder="请输入收件人" />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="电话号码"
                {...formItemLayout}
              >
                {getFieldDecorator('telephone', {
                  initialValue: orderData.telephone,
                  rules: [{ required: true, validator: this.checkPhone.bind(this) }],
                })(
                  <Input placeholder="请输入电话号码" />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="身份证号"
                {...formItemLayout}
              >
                {getFieldDecorator('idcard', {
                  initialValue: orderData.idcard,
                  rules: [{ required: false, validator: this.checkIdCard.bind(this) }],
                })(
                  <Input placeholder="请输入身份证号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="外部订单号"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 18 }}
              >
                {getFieldDecorator('targetNo', {
                  initialValue: orderData.targetNo,
                })(
                  <Input placeholder="请输入外部订单号，如有赞订单号" size="large" style={{ marginLeft: 3, width: 646 }} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <FormItem
                label="收件人地址"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 17 }}
              >
                {getFieldDecorator('address', {
                  initialValue: orderData.address && orderData.address.split(','),
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Cascader options={divisions} placeholder="请选择" style={{ marginLeft: 5 }} />)}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem>
                {getFieldDecorator('addressDetail', {
                  initialValue: orderData.addressDetail,
                  rules: [{ required: true, message: '请输入详细地址' }],
                })(
                  <Input placeholder="请输入详细地址" size="large" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="备注"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 18 }}
              >
                {getFieldDecorator('remarks', {
                  initialValue: orderData.remarks,
                })(
                  <Input placeholder="请输入备注信息" size="large" style={{ marginLeft: 3, width: 646 }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <ProductTable data={orderData.outerOrderDetails} parent={this} />
          </Row>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { salesName } = state.order;
  return {
    salesName,
  };
}

export default connect(mapStateToProps)(Form.create()(ProductsModal));
