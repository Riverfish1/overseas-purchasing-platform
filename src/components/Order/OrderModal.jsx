import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Modal, Table, Pagination, Cascader, message, Input, Upload, InputNumber, Button, Row, Col, Select, DatePicker, Form, Icon, Popconfirm, TreeSelect } from 'antd';
import styles from './Order.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

let uuid = 1;

function getEmptyInput(str) {
}

class ProductsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      skuList: [], // sku数据
      previewVisible: false,
      previewImage: '',
    };
  }

  componentWillMount() {
    
  }

  handleSubmit() {
    let p = this;
    const { form, dispatch, close } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        'startDate': fieldsValue['startDate'] && fieldsValue['startDate'].format('YYYY-MM-DD'),
        'endDate': fieldsValue['endDate'] && fieldsValue['endDate'].format('YYYY-MM-DD'),
      };
      console.log(values);
      dispatch({
        type: 'products/addProducts',
        payload: { ...values },
      });
      close(false);
    });
  }

  addProduct() {
    uuid += 1;
    const obj = {
      color: 'EMPTY', scale: 'EMPTY', inventory: 'EMPTY', virtualInventory: 'EMPTY', weight: 'EMPTY', skuCode: 'EMPTY', id: uuid, order: uuid,    
    };
    const _skuList = [];
    _skuList.push(obj);
    this.setState({ skuList: _skuList });
  }

  handleCancel() {
    this.setState({ previewVisible: false });
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
    let skuData = skuList.filter(item => id !== item.id);
    this.setState({ skuList: skuData });
  }

  render() {
    let p = this;
    const { form, visible, close, brands = [], modalValues = {}, tree=[], } = this.props;
    const { previewVisible, previewImage } = this.state;
    const { getFieldDecorator } = form;
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
        close(false);
      },
    };
    const uploadProps = {
      action: '/haierp1/uploadFile/picUpload',
      listType: 'picture-card',
      data(file) {
        return {
          pic: file.name,
        }
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
        })
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
    const modalTableProps = {
      columns: [
        {
          title: '序号', key: 'order',
          render(text, record, index) {
            return index + 1;
          },
        },
        {
          title: <font color="#00f">商品SKU</font>, dataIndex: 'productSKU', key: 'productSKU',
          render(text, record, index) {
            return <div>{getFieldDecorator('productSKU', {
            })(<Input />)}</div>
          },
        },
        {
          title: '商品名称', dataIndex: 'name', key: 'name',
          render(text, record, index) {
            return <span>{text}</span>
          },
        },
        {
          title: '颜色', dataIndex: 'color', key: 'color',
          render(text, record, index) {
            return <span>{text}</span>
          },
        },
        {
          title: '尺寸', dataIndex: 'scale', key: 'scale',
          render(text, record, index) {
            return <span>{text}</span>
          },
        },
        {
          title: <font color="#00f">销售价</font>, dataIndex: 'salePrice', key: 'salePrice',
          render(text, record, index) {
            return <div>{getFieldDecorator('salePrice', {
            })(<Input />)}</div>
          },
        },
        {
          title: <font color="#00f">运费</font>, dataIndex: 'freight', key: 'freight',
          render(text, record, index) {
            return <div>{getFieldDecorator('freight', {
            })(<Input />)}</div>
          },
        },
        {
          title: <font color="#00f">数量</font>, dataIndex: 'amount', key: 'amount',
          render(text, record, index) {
            return <div>{getFieldDecorator('amount', {
            })(<Input />)}</div>
          },
        },
        {
          title: '操作', key: 'operator',
          render(text, record, index) {
            return <Popconfirm title="确定删除?" onConfirm={p.handleDelete(record.id)}>
                    <a href="javascript:void(0)">删除</a>
                  </Popconfirm>
          },
        },
      ],
      dataSource: modalValues.data ? modalValues.data.itemSkus : p.state.skuList,
      bordered: false,
      pagination: true,
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
                label="订单编号"
                {...formItemLayout}
              >
                {getFieldDecorator('orderCode', {
                  initialValue: modalValues && modalValues.data && modalValues.data.itemCode,
                  rules: [{ message: '请输入订单编号' }],
                })(
                  <Input placeholder="请输入订单编号" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="客户"
                {...formItemLayout}
              >
                {getFieldDecorator('custom', {
                  initialValue: modalValues && modalValues.data && modalValues.data.name,
                  rules: [{ required: true, message: '请选择客户' }],
                })(
                  <Input placeholder="请选择客户" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="订单时间"
                {...formItemLayout}
              >
                {getFieldDecorator('orderTime', {
                  initialValue: modalValues && modalValues.data && modalValues.data.enName,
                  rules: [{ required: true, message: '请输入订单时间' }],
                })(
                  <DatePicker format="YYYY-MM-DD" placeholder="请输入订单时间" />
                )}
              </FormItem>
            </Col>
          </Row>          
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="收件人"
                {...formItemLayout}
              >
                {getFieldDecorator('recipient', {
                  initialValue: modalValues && modalValues.data && modalValues.data.itemShort,
                  rules: [{ required: true, message: '请输入收件人' }],
                })(
                  <Input placeholder="请输入收件人" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="电话号码"
                {...formItemLayout}
              >
                {getFieldDecorator('tel', {
                  initialValue: modalValues && modalValues.data && modalValues.data.categoryId,
                  rules: [{ required: true, message: '请输入电话号码' }],
                })(
                  <Input placeholder="请输入电话号码" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="邮政编码"
                {...formItemLayout}
              >
                {getFieldDecorator('postalCode', {
                  initialValue: modalValues && modalValues.data && modalValues.data.brand,
                  rules: [{ required: true, message: '请输入邮政编码' }],
                })(
                  <Input placeholder="请输入邮政编码" />
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
                {getFieldDecorator('recipientAddr', {
                  initialValue: modalValues && modalValues.data ? (modalValues.data.country === 1 ? '美国' : modalValues.data.country === 2 ? '德国' : modalValues.data.country === 3 ? '日本' : modalValues.data.country === 4 ? '澳洲' : '' ) : '',
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Cascader placeholder="请选择" style={{ marginLeft: 5 }} />
                )}
              </FormItem>
            </Col>
            <Col span={9}>
              {getFieldDecorator('detailAddr', {
                initialValue: modalValues && modalValues.data ? (modalValues.data.country === 1 ? '美国' : modalValues.data.country === 2 ? '德国' : modalValues.data.country === 3 ? '日本' : modalValues.data.country === 4 ? '澳洲' : '' ) : '',
                rules: [{ required: true, message: '请选择国家' }],
              })(
                <Input placeholder="请输入详细地址" size="large" />
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="外部订单号"
                {...formItemLayout}
                labelCol={{ span: 3 }}
              >
                {getFieldDecorator('outOrder', {
                  initialValue: modalValues && modalValues.data ? (modalValues.data.country === 1 ? '美国' : modalValues.data.country === 2 ? '德国' : modalValues.data.country === 3 ? '日本' : modalValues.data.country === 4 ? '澳洲' : '' ) : '',
                  rules: [{ message: '请输入外部订单号，如有赞订单号' }],
                })(
                  <Input placeholder="请输入外部订单号，如有赞订单号" size="large" style={{ marginLeft: 5 }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="备注"
                {...formItemLayout}
                labelCol={{ span: 3 }}
              >
                {getFieldDecorator('outOrder', {
                  initialValue: modalValues && modalValues.data ? (modalValues.data.country === 1 ? '美国' : modalValues.data.country === 2 ? '德国' : modalValues.data.country === 3 ? '日本' : modalValues.data.country === 4 ? '澳洲' : '' ) : '',
                  rules: [{ message: '请输入备注信息' }],
                })(
                  <Input placeholder="请输入备注信息" size="large" style={{ marginLeft: 5 }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col style={{ float: 'left', marginLeft: 20 }}>
              <span>订单明细信息（<font color="#00f">蓝色列可编辑</font>）</span>
            </Col>
            <Col style={{ float: 'right', marginRight: 20 }}>
              <Button type="primary" onClick={this.addProduct.bind(this)}>添加商品</Button>
            </Col>
          </Row>
          <Row>
            <Table
              {...modalTableProps}
              rowKey={record => record.id}
            />
          </Row>
        </Form>
      </Modal>
    );
    
  }

}

function mapStateToProps(state) {
  const { brands } = state.products;
  return {
    loading: state.loading.models.products,
  };
}

ProductsModal.PropTypes = {
  brands: PropTypes.array.isRequired,
};

ProductsModal = Form.create()(ProductsModal);

export default connect(mapStateToProps)(ProductsModal);
