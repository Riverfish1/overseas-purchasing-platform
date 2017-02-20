import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Modal, Table, Pagination, Input, InputNumber, Button, Row, Col, Select, DatePicker, Form, Icon } from 'antd';
import styles from './Category.less';

const FormItem = Form.Item;
const Option = Select.Option;

class CategoryModal extends Component {

  constructor() {
    super();
    this.state = {
      skuList: [], // sku数据
    };
  }

  handleSubmit() {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log(fieldsValue);
      const values = {
        ...fieldsValue,
        'startDate': fieldsValue['startDate'].format('YYYY-MM-DD'),
        'endDate': fieldsValue['endDate'].format('YYYY-MM-DD'),
      };
      dispatch({
        type: 'products/addCategory',
        payload: { ...values },
      });
    });
  }

  addSKU() {
    const { skuList } = this.state;
    const { form } = this.props;
    const { setFieldsValue } = form;
    let id = 1;
    skuList.push({
      color: '', scale: '', inventory: '', virtualInventory: '', weight: '', skuCode: '', id,
    });
  }

  handleDelete(id) {
    const { skuList } = this.state;
    skuList.filter(item => id !== item.id);
  }

  render() {
    let that = this;
    const { form, visible, close } = this.props;
    const { getFieldDecorator } = form;
    const modalProps = {
      visible,
      wrapClassName: 'modalStyle',
      title: '添加',
      maskClosable: false,
      closable: true,
      onOk() {
        that.handleSubmit();
      },
      onCancel() {
        close(false);
      },
    };
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };

    return (
      <Modal 
        {...modalProps}
      >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row>
            <Col span={12}>
              <FormItem
                label="类别名称"
                {...formItemLayout}
              >
                {getFieldDecorator('cateName', {
                  rules: [{ required: true, message: '请输入类别名称' }],
                })(
                  <Input placeholder="请输入类别名称" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="类别代码"
                {...formItemLayout}
              >
                {getFieldDecorator('cateCode', {
                  rules: [{ message: '请输入类别代码' }],
                })(
                  <Input placeholder="请输入类别代码" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label="服务费率"
                {...formItemLayout}
              >
                {getFieldDecorator('servicesRate', {
                  rules: [{ required: true, message: '请输入服务费率' }],
                })(
                  <InputNumber style={{width: 142.5}} step={0.01} min={0} placeholder="请输入服务费率" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="有赞类别"
                {...formItemLayout}
              >
                {getFieldDecorator('youzanCate', {
                  rules: [{ message: '请输入有赞类别' }],
                })(
                  <Select placeholder="请输入有赞类别" >
                    <Option value="1">男人</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label="淘宝类别"
                {...formItemLayout}
              >
                {getFieldDecorator('taobaoCate', {
                  rules: [{ message: '请输入淘宝类别' }],
                })(
                  <Select placeholder="请输入淘宝类别" >
                    <Option value="1">男人</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="说明"
                {...formItemLayout}
              >
                {getFieldDecorator('itemCode', {
                  rules: [{ message: '请输入说明' }],
                })(
                  <Input placeholder="请输入说明" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type="primary" onClick={this.addSKU.bind(this)}>选择属性</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
    
  }

}

function mapStateToProps(state) {
  const { dataSource } = state.products;
  return {
    loading: state.loading.models.products,
    dataSource,
  };
}

CategoryModal = Form.create()(CategoryModal);

export default connect(mapStateToProps)(CategoryModal);
