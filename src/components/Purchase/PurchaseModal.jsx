import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Modal, message, Upload, Icon, Input, Select, Row, Col, DatePicker, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ProductTable from './ProductTable';
import styles from './Purchase.less';
import * as check from '../../utils/checkLib';

moment.locale('zh-cn');


const FormItem = Form.Item;
const Option = Select.Option;

class PurchaseModal extends Component {

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
            type: 'purchase/updatePurchase',
            payload: { ...fieldsValue, id: modalValues.data.id, orderDetailList: JSON.stringify(orderDetailList) },
          });
        } else {
          dispatch({
            type: 'purchase/addPurchase',
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
    const { previewVisible, previewImage } = p.state;
    const purchaseData = (modalValues && modalValues.data) || {};
    const { getFieldDecorator } = form;
    let picList = [];
    if (purchaseData.imageUrl) {
      const picObj = purchaseData.imageUrl;
      picList = picObj.picList || [];
    }
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
                label="任务名称"
                {...formItemLayout}
              >
                {getFieldDecorator('taskTitle', {
                  initialValue: purchaseData.taskTitle,
                  rules: [{ required: true, message: '请输入任务名称' }],
                })(
                  <Input placeholder="请输入任务名称" />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="买手"
                {...formItemLayout}
              >
                {getFieldDecorator('userId', {
                  initialValue: purchaseData.userId,
                  rules: [{ required: true, message: '请选择用户' }],
                })(
                  <Select placeholder="请选择用户" combobox>
                    <Option value="1">所有</Option>
                    {buyer.map(el => <Option key={el.id} value={el.name}>{el.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="采购类型"
                {...formItemLayout}
              >
                {getFieldDecorator('purType', {
                  initialValue: purchaseData.purType,
                })(
                  <Select placeholder="请选择采购类型" allowClear>
                    <Option value="0">订单采购</Option>
                    <Option value="1">囤货采购</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="采购单号"
                {...formItemLayout}
              >
                {getFieldDecorator('purOrderNo', {
                  initialValue: purchaseData.purOrderNo,
                })(
                  <Input placeholder="请输入采购单号" />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="任务开始时间"
                {...formItemLayout}
              >
                {getFieldDecorator('taskStartTime', {
                  initialValue: purchaseData.taskStartTime,
                })(
                  <DatePicker />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="任务结束时间"
                {...formItemLayout}
              >
                {getFieldDecorator('taskEndTime', {
                  initialValue: purchaseData.taskEndTime,
                })(
                  <DatePicker />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="任务描述"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 18 }}
              >
                {getFieldDecorator('taskDesc', {
                  initialValue: purchaseData.taskDesc,
                })(
                  <Input placeholder="请输入任务描述" size="large" style={{ marginLeft: 5 }} />)}
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
                {getFieldDecorator('remark', {
                  initialValue: purchaseData.remark,
                })(
                  <Input placeholder="请输入备注信息" size="large" style={{ marginLeft: 5 }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="添加图片"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 18 }}
                style={{ marginRight: '-20px' }}
              >
                {getFieldDecorator('imageUrl', {
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
          <Row>
            <ProductTable data={purchaseData.orderDetails} parent={this} />
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

PurchaseModal.PropTypes = {
  salesName: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(Form.create()(PurchaseModal));
