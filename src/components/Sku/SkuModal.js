import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Modal, Input, InputNumber, Row, Col, Form, Icon, Upload } from 'antd';
import styles from './Sku.less';

const FormItem = Form.Item;

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
      console.log(fieldsValue);
      if (err) {
        return;
      }
      dispatch({
        type: 'sku/addSku',
        payload: { ...fieldsValue },
      });
    });
  }

  handleCancel() {
    this.setState({
      previewVisible: false,
    });
  }

  checkImg(rules, value, callback) {

  }

  closeModal() {
    const { close, form } = this.props;
    form.resetFields();
    close(false);
  }

  render() {
    const p = this;
    const { previewVisible, previewImage } = p.state;
    const { form, visible, modalValues = {} } = p.props;
    const { getFieldDecorator } = form;
    const skuModalData = modalValues.data || {};

    let picList = [];
    if (skuModalData.mainPic) {
      const picObj = JSON.parse(skuModalData.mainPic);
      picList = picObj.picList || [];
    }

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
        p.closeModal();
      },
    };
    const formItemLayout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    };
    const uploadProps = {
      action: '/uploadFile/picUpload',
      listType: 'picture-card',
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
        });
      },
      onChange({ fileList }) {
        p.setState({ fileList });
      },
    };
    return (
      <Modal
        {...modalProps}
        className={styles.modalStyle}
      >
        <Form>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="SKU"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {
                  initialValue: skuModalData.skuCode,
                })(
                  <Input placeholder="请输入SKU" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="颜色"
                {...formItemLayout}
              >
                {getFieldDecorator('color', {
                  initialValue: skuModalData.color,
                })(
                  <Input placeholder="请输入颜色" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="尺寸"
                {...formItemLayout}
              >
                {getFieldDecorator('scale', {
                  initialValue: skuModalData.scale,
                })(
                  <Input placeholder="请输入尺寸" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="upc"
                {...formItemLayout}
              >
                {getFieldDecorator('upc', {
                  initialValue: skuModalData.upc,
                })(
                  <Input placeholder="请输入upc" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="虚拟库存"
                {...formItemLayout}
              >
                {getFieldDecorator('virtualInventory', {
                  initialValue: skuModalData.virtualInventory,
                })(
                  <Input placeholder="请输入虚拟库存" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="重量(kg)"
                {...formItemLayout}
              >
                {getFieldDecorator('weight', {
                  initialValue: skuModalData.weight,
                })(
                  <InputNumber skep={0.01} placeholder="请输入重量" />,
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
                {getFieldDecorator('mainPic', {
                  initialValue: picList,
                  rules: [{ validator: this.checkImg.bind(this) }],
                })(
                  <div>
                    <Upload {...uploadProps}>
                      <Icon type="plus" className={styles.uploadPlus} />
                      <div className="ant-upload-text">上传图片</div>
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} />
                    </Modal>
                  </div>,
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

SkuModal.PropTypes = {
  skuList: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Form.create()(SkuModal));
