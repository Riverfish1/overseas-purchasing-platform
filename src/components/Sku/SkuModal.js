import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Modal, Table, Pagination, Input, InputNumber, Button, Row, Col, Select, DatePicker, Form, Icon } from 'antd';
import styles from './Sku.less';

const FormItem = Form.Item;
const Option = Select.Option;

class SkuModal extends Component {

  constructor() {
    super();
    this.state = {
      skuList: [], // sku数据
      previewVisible: false, // 上传图片的modal是否显示
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
        type: 'products/addSku',
        payload: { ...values },
      });
    });
  }

  handleCancel() {

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
    const { previewVisible, skuList } = this.state;
    const { form, visible, close } = this.props;
    const { getFieldDecorator } = form;
    const modalProps = {
      visible,
      width: 900,
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
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    };
    const uploadProps = {

    };
    return (
      <Modal 
        {...modalProps}
      >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="SKU"
                {...formItemLayout}
              >
                {getFieldDecorator('itemCode', {
                  rules: [{ message: '请输入SKU' }],
                })(
                  <Input placeholder="请输入SKU" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="货品"
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请选择货品' }],
                })(
                  <Select placeholder="请选择货品" >
                    <Option value="1">好</Option>
                    <Option value="2">中等</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="条码"
                {...formItemLayout}
              >
                {getFieldDecorator('enName', {
                  rules: [{ message: '请输入条码' }],
                })(
                  <Input placeholder="请输入条码" />
                )}
              </FormItem>
            </Col>
          </Row>          
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="允许销售"
                {...formItemLayout}
              >
                {getFieldDecorator('itemShort', {
                  rules: [{ message: '请输入允许销售' }],
                })(
                  <Select placeholder="请输入允许销售" >
                    <Option value="1">是</Option>
                    <Option value="0">否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="商品颜色"
                {...formItemLayout}
              >
                {getFieldDecorator('categoryId', {
                  rules: [{ message: '请输入商品颜色' }],
                })(
                  <Input placeholder="请输入商品颜色" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="商品尺寸"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {
                  rules: [{ message: '请输入商品尺寸' }],
                })(
                  <Select placeholder="请输入商品尺寸" >
                    <Option value="100">优衣库</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="成本价"
                {...formItemLayout}
              >
                {getFieldDecorator('spec', {
                  rules: [{ required: true, message: '请输入成本价' }],
                })(
                  <InputNumber step={0.01} min={0} placeholder="请输入成本价" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="预估运费（人民币）"
                {...formItemLayout}
              >
                {getFieldDecorator('model', {
                  rules: [{ required: true, message: '请输入预估运费（人民币）' }],
                })(
                  <InputNumber step={0.01} min={0} placeholder="请输入预估运费（人民币）" />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem
                label="销售价（人民币）"
              >
                {getFieldDecorator('weight', {
                  initialValue: '0',
                  rules: [{ required: true, message: '请输入销售价（人民币）' }],
                })(
                  <InputNumber step={0.01} min={0} placeholder="请输入销售价（人民币）" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="可售库存"
                {...formItemLayout}
              >
                {getFieldDecorator('unit', {
                  rules: [{ required: true, message: '请输入可售库存' }],
                })(
                  <InputNumber step={1} min={0} placeholder="请输入可售库存" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="备注"
                {...formItemLayout}
              >
                {getFieldDecorator('origin', {
                  rules: [{ message: '请输入备注' }],
                })(
                  <Input type="textarea" placeholder="请输入备注" />
                )}
              </FormItem>
            </Col>
          </Row>
          {/*<Row gutter={10}>
            <Col>
              <FormItem
                label="添加图片"
                {...formItemLayout}
              >
                {getFieldDecorator('picUrl', { rules: [{ validator: this.checkImg.bind(this) }] })(
                  <Upload {...uploadProps}>
                    <Icon type="plus" className="upload-plus" />
                    <div className="ant-upload-text">上传图片</div>
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} />
                  </Modal>
                )}
              </FormItem>
            </Col>
          </Row>*/}
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

SkuModal = Form.create()(SkuModal);

export default connect(mapStateToProps)(SkuModal);
