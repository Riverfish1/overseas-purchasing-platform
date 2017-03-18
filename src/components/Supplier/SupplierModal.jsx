import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, message, Input, Upload, Row, Col, Select, DatePicker, Form, Icon, TreeSelect } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

import SkuTable from './SkuTable';
import style from './Supplier.less';

moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

function toString(str, type) {
  if (typeof str !== 'undefined' && str !== null) {
    return str.toString();
  }
  if (type === 'SELECT') return undefined;
  return '';
}

class SupplierModal extends Component {

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
    const { form, dispatch, modalValues } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }

      // 检验sku是否填写
      p.getSkuValue((skuList) => {
        console.log(skuList);
        const values = {
          ...fieldsValue,
          startDate: fieldsValue.startDate && fieldsValue.startDate.format('YYYY-MM-DD'),
          endDate: fieldsValue.endDate && fieldsValue.endDate.format('YYYY-MM-DD'),
          skuList: encodeURIComponent(JSON.stringify(skuList)),
        };

        // 处理图片
        if (values.mainPic) {
          const uploadMainPic = [];
          const mainPicNum = values.mainPicNum;
          values.mainPic.forEach((el) => {
            uploadMainPic.push({
              type: el.type,
              uid: el.uid,
              url: el.url,
            });
          });
          values.mainPic = encodeURIComponent(JSON.stringify({ picList: uploadMainPic, mainPicNum }));
        }
        console.log(values);
        if (modalValues && modalValues.data) {
          dispatch({
            type: 'products/updateProducts',
            payload: { ...values, id: modalValues.data.id },
          });
        } else {
          dispatch({
            type: 'products/addProducts',
            payload: { ...values },
          });
        }
        this.closeModal();
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

  checkImg(rules, values, callback) {
    callback();
  }

  checkMainPicNum(rules, value, callback) {
    callback();
  }

  // queryItemSkus(param) {
  //   const { modalValues = {} } = this.props;
  //   modalValues.data && modalValues.data.itemSkus.map(item => {
  //     return item[param];
  //   });
  // }

  render() {
    const p = this;
    const { form, visible, brands = [], modalValues = {}, tree = [], packageScales, scaleTypes } = this.props;
    const { previewVisible, previewImage } = this.state;
    const { getFieldDecorator } = form;

    // 图片字符串解析
    let mainPicNum;
    let picList = [];
    if (modalValues && modalValues.data && modalValues.data.mainPic) {
      const picObj = JSON.parse(modalValues.data.mainPic);
      mainPicNum = toString(picObj.mainPicNum, 'SELECT') || '1';
      picList = picObj.picList || [];
    }

    // 详情数据
    const productData = (modalValues && modalValues.data) || {};

    const modalProps = {
      visible,
      width: 900,
      wrapClassName: 'modalStyle',
      title: '添加',
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
      <Modal
        {...modalProps}
        className={style.modalStyle}
      >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="商品编码"
                {...formItemLayout}
              >
                {getFieldDecorator('itemCode', {
                  initialValue: toString(productData.itemCode),
                  rules: [{ message: '请输入商品编码' }],
                })(
                  <Input placeholder="请输入商品编码" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  initialValue: toString(productData.name),
                  rules: [{ required: true, message: '请输入商品名称' }],
                })(
                  <Input placeholder="请输入商品名称" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="英文名称"
                {...formItemLayout}
              >
                {getFieldDecorator('enName', {
                  initialValue: toString(productData.enName),
                  rules: [{ message: '请输入英文名称' }],
                })(
                  <Input placeholder="请输入英文名称" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="商品简称"
                {...formItemLayout}
              >
                {getFieldDecorator('itemShort', {
                  initialValue: toString(productData.itemShort),
                  rules: [{ message: '请输入商品简称' }],
                })(
                  <Input placeholder="请输入商品简称" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="所属类目"
                {...formItemLayout}
              >
                {getFieldDecorator('categoryId', {
                  initialValue: toString(productData.categoryId, 'SELECT'),
                  rules: [{ required: true, message: '请选择所属类目' }],
                })(
                  <TreeSelect placeholder="请选择所属类目" treeData={tree} />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="品牌"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {
                  initialValue: toString(productData.brand, 'SELECT'),
                  rules: [{ required: true, message: '请输入品牌' }],
                })(
                  <Select placeholder="请输入品牌" combobox>
                    {brands && brands.map(item => <Option key={item.id.toString()} value={item.name}>{item.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="国家"
                {...formItemLayout}
              >
                {getFieldDecorator('country', {
                  initialValue: toString(productData.country, 'SELECT'),
                  rules: [{ required: true, message: '请选择国家' }],
                })(
                  <Select placeholder="请选择国家">
                    <Option value="1">美国</Option>
                    <Option value="2">德国</Option>
                    <Option value="3">日本</Option>
                    <Option value="4">澳洲</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="币种"
                {...formItemLayout}
              >
                {getFieldDecorator('currency', {
                  initialValue: toString(productData.currency, 'SELECT'),
                  rules: [{ required: true, message: '请选择币种' }],
                })(
                  <Select placeholder="请选择币种">
                    <Option value="1">人民币</Option>
                    <Option value="2">美元</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="是否身份证"
                {...formItemLayout}
              >
                {getFieldDecorator('idCard', {
                  initialValue: toString(productData.idCard, 'SELECT'),
                  rules: [{ required: true, message: '请选择是否身份证' }],
                })(
                  <Select placeholder="请选择是否身份证">
                    <Option value="1">是</Option>
                    <Option value="2">否</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="销售开始时间"
                {...formItemLayout}
              >
                {getFieldDecorator('startDate', {
                  initialValue: (productData.startDateStr && moment(productData.startDateStr, 'YYYY-MM-DD')) || undefined,
                })(
                  <DatePicker format="YYYY-MM-DD" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="销售结束时间"
                {...formItemLayout}
              >
                {getFieldDecorator('endDate', {
                  initialValue: (productData.endDateStr && moment(modalValues.data.endDateStr, 'YYYY-MM-DD')) || undefined,
                })(
                  <DatePicker format="YYYY-MM-DD" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="采购站点"
                {...formItemLayout}
              >
                {getFieldDecorator('buySite', {
                  initialValue: toString(productData.buySite),
                  rules: [{ message: '请输入采购站点' }],
                })(
                  <Input placeholder="请输入采购站点" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="联系人"
                {...formItemLayout}
              >
                {getFieldDecorator('contactPerson', {
                  initialValue: toString(productData.contactPerson),
                  rules: [{ message: '请输入联系人' }],
                })(
                  <Input placeholder="请输入联系人" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="产地"
                {...formItemLayout}
              >
                {getFieldDecorator('origin', {
                  initialValue: toString(productData.origin),
                  rules: [{ message: '请输入产地' }],
                })(
                  <Input placeholder="请输入产地" />,
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="联系电话"
                {...formItemLayout}
              >
                {getFieldDecorator('contactTel', {
                  initialValue: toString(productData.contactTel),
                  rules: [{ message: '请输入联系电话' }],
                })(
                  <Input placeholder="请输入联系电话" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="备注"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 11 }}
                style={{ marginRight: '-20px' }}
              >
                {getFieldDecorator('remark', {
                  initialValue: toString(productData.remark),
                  rules: [{ message: '请输入备注' }],
                })(
                  <Input type="textarea" placeholder="请输入备注" />,
                )}
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
                    <Icon type="plus" className={style.uploadPlus} />
                    <div className="ant-upload-text">上传图片</div>
                  </Upload>,
                )}

                <Modal visible={previewVisible} title="预览图片" footer={null} onCancel={this.handleCancel.bind(this)}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="选择主图"
                {...formItemLayout}
              >
                {getFieldDecorator('mainPicNum', {
                  initialValue: mainPicNum,
                  rules: [{ validator: this.checkMainPicNum.bind(this) }],
                })(
                  <Select placeholder="请选择主图">
                    <Option value="1">图片1</Option>
                    <Option value="2">图片2</Option>
                    <Option value="3">图片3</Option>
                    <Option value="4">图片4</Option>
                    <Option value="5">图片5</Option>
                    <Option value="6">图片6</Option>
                    <Option value="7">图片7</Option>
                    <Option value="8">图片8</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <SkuTable
              data={productData.itemSkus}
              packageScales={packageScales}
              scaleTypes={scaleTypes}
              parent={p}
            />
          </Row>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { packageScales, scaleTypes } = state.sku;
  // const { brands } = state.products;
  return {
    packageScales,
    scaleTypes,
    loading: state.loading.models.products,
  };
}

export default connect(mapStateToProps)(Form.create()(SupplierModal));
