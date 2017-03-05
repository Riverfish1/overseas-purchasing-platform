import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Modal, Input, InputNumber, Row, Col, Form, Icon, Upload, Select, message } from 'antd';
import styles from './Sku.less';

const FormItem = Form.Item;
const Option = Select.Option;

function toString(str, type) {
  if (typeof str !== 'undefined' && str !== null) {
    return str.toString();
  }
  if (type === 'SELECT') return undefined;
  return '';
}

class SkuModal extends Component {

  constructor() {
    super();
    this.state = {
      previewVisible: false, // 上传图片的modal是否显示
      previewImage: '', // 上传图片的url
    };
  }

  handleSubmit() {
    const { form, dispatch, modalValues } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) {
        return;
      }
      if (fieldsValue.mainPic) {
        const uploadMainPic = [];
        fieldsValue.mainPic.forEach((item) => {
          uploadMainPic.push({
            uid: item.uid,
            type: item.type,
            url: item.url,
          });
        });
        fieldsValue.mainPic = encodeURIComponent(JSON.stringify({ picList: uploadMainPic }));
      }
      if (modalValues.data) {
        fieldsValue.id = modalValues.data.id;
        dispatch({
          type: 'sku/updateSku',
          payload: { ...fieldsValue },
        });
      } else {
        dispatch({
          type: 'sku/addSku',
          payload: { ...fieldsValue },
        });
      }
    });
  }

  handleCancel() {
    this.setState({
      previewVisible: false,
    });
  }

  checkImg(rules, value, callback) {
    callback();
  }

  closeModal() {
    const { close, form } = this.props;
    form.resetFields();
    close(false);
  }

  render() {
    const p = this;
    const { previewVisible, previewImage } = p.state;
    const { form, visible, modalValues = {}, brands = [] } = p.props;
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
      action: '/haierp1/uploadFile/picUpload',
      listType: 'picture-card',
      multiple: true,
      data(file) {
        return {
          pic: file.name,
        };
      },
      beforeUpload(file) {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/gif' || file.type === 'image/png';
        if (!isImg) { message.error('请上传图片文件'); }
        return isImg;
      },
      name: 'pic',
      onPreview(file) {
        p.setState({
          previewVisible: true,
          previewImage: file.url || file.thumbUrl,
        });
      },
      onChange(info) {
        if (info.file.status === 'done') {
          if (info.file.response && info.file.response.success) {
            message.success(`${info.file.name} 成功上传`);
            // 添加文件预览
            const newFile = info.file;
            newFile.url = info.file.response.data;
            console.log(info.fileList);
          } else { message.error(`${info.file.name} 解析失败：${info.file.response.msg || info.file.response.errorMsg}`); }
        } else if (info.file.status === 'error') { message.error(`${info.file.name} 上传失败`); }
        // 限制一个图片
        const fileLength = info.fileList.length;
        p.setState({ certFileList: fileLength > 1 ? [info.fileList[fileLength - 1]] : info.fileList });
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
                  initialValue: toString(skuModalData.skuCode),
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
                  initialValue: toString(skuModalData.color),
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
                  initialValue: toString(skuModalData.scale),
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
                  initialValue: toString(skuModalData.upc),
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
                  initialValue: toString(skuModalData.virtualInventory),
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
                  initialValue: toString(skuModalData.weight),
                })(
                  <InputNumber skep={0.01} placeholder="请输入重量" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="sku名称"
                {...formItemLayout}
              >
                {getFieldDecorator('itemName', {
                  initialValue: toString(skuModalData.itemName),
                })(
                  <Input placeholder="请输入sku名称" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="品牌"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {
                  initialValue: toString(skuModalData.brand, 'SELECT'),
                })(
                  <Select placeholder="请选择品牌" >
                    {brands.map(item => <Option key={item.id.toString()}>{item.name}</Option>)}
                  </Select>,
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
                  valuePropName: 'fileList',
                  getValueFromEvent(e) {
                    if (!e || !e.fileList) {
                      return e;
                    }
                    const { fileList } = e;
                    return fileList;
                  },
                  rules: [{ validator: this.checkImg.bind(this) }],
                })(
                  <Upload {...uploadProps}>
                    <Icon type="plus" className={styles.uploadPlus} />
                    <div className="ant-upload-text">上传图片</div>
                  </Upload>,
                )}

                <Modal visible={previewVisible} title="预览图片" footer={null} onCancel={this.handleCancel.bind(this)}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
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
