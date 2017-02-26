import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Modal, Table, Cascader, Input, Button, Select, Row, Col, DatePicker, Form, Popconfirm } from 'antd';
import styles from './Order.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

let uuid = 1;

class ProductsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      skuList: [], // sku数据
      previewVisible: false,
      previewImage: '',
    };
  }

  handleSubmit() {
    const p = this;
    const { form, dispatch, close } = p.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        orderTime: fieldsValue.orderTime && fieldsValue.orderTime.format('YYYY-MM-DD'),
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
    const skuData = skuList.filter(item => id !== item.id);
    this.setState({ skuList: skuData });
  }

  render() {
    const p = this;
    const { form, visible, close, modalValues = {} } = p.props;
    const { getFieldDecorator } = form;
    const modalProps = {
      visible,
      width: 900,
      wrapClassName: 'modalStyle',
      okText: '保存',
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
    const formItemLayout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    };
    const modalTableProps = {
      columns: [
        {
          title: <font color="#00f">商品SKU</font>,
          dataIndex: 'productSKU',
          key: 'productSKU',
          render() {
            return <div>{getFieldDecorator('productSKU', {})(<Input />)}</div>;
          },
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name',
          render(text) {
            return <span>{text}</span>;
          },
        },
        {
          title: '颜色',
          dataIndex: 'color',
          key: 'color',
          render(text) {
            return <span>{text}</span>;
          },
        },
        {
          title: '尺寸',
          dataIndex: 'scale',
          key: 'scale',
          render(text) {
            return <span>{text}</span>;
          },
        },
        {
          title: <font color="#00f">销售价</font>,
          dataIndex: 'salePrice',
          key: 'salePrice',
          render() {
            return <div>{getFieldDecorator('salePrice', {})(<Input />)}</div>;
          },
        },
        {
          title: <font color="#00f">运费</font>,
          dataIndex: 'freight',
          key: 'freight',
          render() {
            return <div>{getFieldDecorator('freight', {})(<Input />)}</div>;
          },
        },
        {
          title: <font color="#00f">数量</font>,
          dataIndex: 'amount',
          key: 'amount',
          render() {
            return <div>{getFieldDecorator('amount', {})(<Input />)}</div>;
          },
        },
        {
          title: '操作',
          key: 'operator',
          render(text, record) {
            return (<Popconfirm title="确定删除?" onConfirm={p.handleDelete(record.id)}>
              <a href="javascript:void(0)">删除</a>
            </Popconfirm>);
          },
        },
      ],
      dataSource: modalValues.data ? modalValues.data.itemSkus : p.state.skuList,
      bordered: false,
      pagination: true,
    };
    const orderData = (modalValues && modalValues.data) || {};

    const options = [{
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
          value: 'xihu',
          label: 'West Lake',
        }],
      }],
    }, {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
          value: 'zhonghuamen',
          label: 'Zhong Hua Men',
        }],
      }],
    }];

    return (
      <Modal {...modalProps} className={styles.modalStyle} >
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
                  <Input placeholder="请输入订单编号" />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="客户"
                {...formItemLayout}
              >
                {getFieldDecorator('salesName', {
                  initialValue: orderData.salesName,
                  rules: [{ required: true, message: '请选择客户' }],
                })(
                  <Select placeholder="请选择客户" >
                    <Option value="0">张三</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="订单时间"
                {...formItemLayout}
              >
                {getFieldDecorator('orderTime', {
                  initialValue: orderData.orderTime && moment(orderData.orderTime, 'YYYY-MM-DD'),
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
                  rules: [{ required: true, message: '请输入收件人' }],
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
                  rules: [{ required: true, message: '请输入电话号码' }],
                })(
                  <Input placeholder="请输入电话号码" />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="邮政编码"
                {...formItemLayout}
              >
                {getFieldDecorator('postCode', {
                  initialValue: orderData.postCode,
                  rules: [{ required: true, message: '请输入邮政编码' }],
                })(
                  <Input placeholder="请输入邮政编码" />)}
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
                  initialValue: orderData.address,
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Cascader options={options} placeholder="请选择" style={{ marginLeft: 5 }} />)}
              </FormItem>
            </Col>
            <Col span={9}>
              {getFieldDecorator('address_detail', {
                initialValue: orderData.address_detail,
                rules: [{ required: true, message: '请输入详细地址' }],
              })(
                <Input placeholder="请输入详细地址" size="large" />)}
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
                  <Input placeholder="请输入外部订单号，如有赞订单号" size="large" style={{ marginLeft: 5 }} />)}
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
            <Col style={{ float: 'left', marginLeft: 20 }}>
              <span>订单明细信息（<font color="#00f">蓝色列可编辑</font>）</span>
            </Col>
            <Col style={{ float: 'right', marginRight: 20 }}>
              <Button type="primary" onClick={p.addProduct.bind(p)}>添加商品</Button>
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
  const { salesName } = state.order;
  return {
    loading: state.loading.models.products,
    salesName,
  };
}

ProductsModal.PropTypes = {
  salesName: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(Form.create()(ProductsModal));
