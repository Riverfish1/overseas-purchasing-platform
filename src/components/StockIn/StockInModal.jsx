import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Modal, Input, Select, Row, Col, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ProductTable from './ProductTable';
import styles from './StockIn.less';
import * as check from '../../utils/checkLib';

moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

class StockInModal extends Component {

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
            payload: { ...fieldsValue, id: modalValues.data.id, orderDetailList: JSON.stringify(orderDetailList) },
          });
        } else {
          dispatch({
            type: 'order/addOrder',
            payload: { ...fieldsValue, orderDetailList: JSON.stringify(orderDetailList) },
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
    if (check.phone(value)) {
      callback();
    } else {
      callback(new Error('请填写正确的手机号'));
    }
  }

  checkPostcode(rules, value, callback) {
    if (check.postcode(value)) {
      callback();
    } else {
      callback(new Error('请填写正确的邮政编码'));
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
    const { form, title, visible, modalValues = {}, buyer = [] } = p.props;
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
      <Modal {...modalProps} className={styles.modalStyle} >
        <Form onSubmit={p.handleSubmit.bind(p)}>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="入库单号"
                {...formItemLayout}
              >
                {getFieldDecorator('stoOrderNo', {})(
                  <Input placeholder="请输入入库单号" />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="买手"
                {...formItemLayout}
              >
                {getFieldDecorator('buyer', {})(
                  <Select placeholder="请选择用户">
                    <Option value="1">所有</Option>
                    {buyer.map(el => <Option key={el.id} value={el.name}>{el.name}</Option>)}
                  </Select>,
                )}
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
                  <Input placeholder="请输入备注信息" size="large" style={{ marginLeft: 5 }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <ProductTable data={orderData.orderDetails} parent={this} />
          </Row>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { salesName } = state.order;
  return {
    loading: state.loading.models.products,
    salesName,
  };
}

StockInModal.PropTypes = {
  salesName: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(Form.create()(StockInModal));
