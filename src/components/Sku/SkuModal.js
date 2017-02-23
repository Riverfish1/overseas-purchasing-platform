import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Modal, Table, Pagination, Input, InputNumber, Button, Row, Col, Select, DatePicker, Form, Icon, Upload } from 'antd';
import styles from './Sku.less';

const FormItem = Form.Item;
const Option = Select.Option;

class SkuModal extends Component {

  constructor() {
    super();
    this.state = {
      previewVisible: false, // 上传图片的modal是否显示
      previewImage: '', // 上传图片的url
    };
  }

  handleSubmit() {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log(fieldsValue);
      dispatch({
        type: 'products/addSku',
        payload: { ...fieldsValue },
      });
    });
  }

  handleCancel() {

  }

  checkImg(rules, value, callback) {

  }

  render() {
    let p = this;
    const { previewVisible, previewImage, skuList } = this.state;
    const { form, visible, close } = this.props;
    const { getFieldDecorator } = form;
    const modalProps = {
      visible,
      width: 900,
      title: '添加',
      wrapClassName: 'modalStyle',
      maskClosable: false,
      closable: true,
      onOk() {
        p.handleSubmit();
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
      action: "/uploadFile/picUpload",
      listType: "picture-card",
      fileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
      onPreview(file) {
        p.setState({
          previewVisible: true,
          previewImage: file.url || file.thumbUrl,
        })
      },
      onChange({ fileList }) {
        p.setState({ fileList, })
      },
    };
    return (
      <Modal 
        {...modalProps}
        className={styles.modalStyle}
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
                  <InputNumber style={{ width: '100%' }} step={0.01} min={0} placeholder="请输入成本价" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="预估运费(rmb)"
                {...formItemLayout}
              >
                {getFieldDecorator('model', {
                  rules: [{ required: true, message: '请输入预估运费(rmb)' }],
                })(
                  <InputNumber style={{ width: '100%' }} step={0.01} min={0} placeholder="请输入预估运费(rmb)" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="销售价(rmb)"
                {...formItemLayout}
              >
                {getFieldDecorator('weight', {
                  rules: [{ required: true, message: '请输入销售价(rmb)' }],
                })(
                  <InputNumber style={{ width: '100%' }} step={0.01} min={0} placeholder="请输入销售价(rmb)" />
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
                  <InputNumber style={{ width: '100%' }} step={1} min={0} placeholder="请输入可售库存" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="备注"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 9 }}
                style={{ marginRight: '-20px' }}
              >
                {getFieldDecorator('origin', {
                  rules: [{ message: '请输入备注' }],
                })(
                  <Input type="textarea" placeholder="请输入备注" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="添加图片"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 9 }}
                style={{ marginRight: '-20px' }}
              >
                {getFieldDecorator('picUrl', { rules: [{ validator: this.checkImg.bind(this) }] })(
                  <div>
                    <Upload {...uploadProps}>
                      <Icon type="plus" className={styles.uploadPlus} />
                      <div className="ant-upload-text">上传图片</div>
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} />
                    </Modal>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
    
  }

}

function mapStateToProps(state) {
  const { skuList } = state.products;
  return {
    loading: state.loading.models.products,
    skuList,
  };
}

SkuModal = Form.create()(SkuModal);

export default connect(mapStateToProps)(SkuModal);
