import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Pagination, Input, Button, Row, Col, Select, DatePicker, Form, Icon } from 'antd';
import ProductsModal from './ProductsModal';
import styles from './Products.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

class Products extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, filedsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...filedsValue,
        'startDateStr': filedsValue['startDateStr'].format('YYYY-MM-DD'),
        'endDateStr': filedsValue['endDateStr'].format('YYYY-MM-DD'),
      };
      console.log(values);
      this.props.dispatch({
        type: 'products/queryItemList',
        payload: {
          ...values
        },
      });
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
    })
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
  }

  render() {

    const columns = [
      {
        title: '序号', dataIndex: 'order', key: 'order',
        render(text, record, index) {
          return index + 1;
        },
      },
      {
        title: '商品名称', dataIndex: 'name', key: 'name',
      },
      {
        title: '商品代码', dataIndex: 'itemCode', key: 'itemCode',
      },
      {
        title: '商品图片', dataIndex: 'mainPic', key: 'mainPic',
      },
      {
        title: '商品品牌', dataIndex: 'brand', key: 'brand',
      },
      {
        title: '销售类型', dataIndex: 'saleType', key: 'saleType',
      },
      {
        title: '商品类目', dataIndex: 'categoryId', key: 'categoryId',
      },
      {
        title: '采购地点', dataIndex: 'buySite', key: 'buySite',
      },
      {
        title: '开始销售时间', dataIndex: 'startDate', key: 'startDate',
      },
      {
        title: '结束销售时间', dataIndex: 'endDate', key: 'endDate',
      },
    ];

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { productsList, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.normal}>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={40}>
            <Col span={6}>
              <FormItem
                label="商品编码"

                {...formItemLayout}
              >
                {getFieldDecorator('itemCode', {
                  rules: [{ required: true, message: '请输入商品编码' }],
                })(
                  <Input placeholder="请输入商品编码"/>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="商品名称"

                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入商品名称' }],
                })(
                  <Input placeholder="请输入商品名称"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={6}>
              <FormItem
                label="类目"
                {...formItemLayout}
              >
                {getFieldDecorator('categoryId', {
                  rules: [{ required: true, message: '请选择类目' }],
                })(
                  <Select placeholder="请选择类目">
                    <Option value="103">衣服</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="品牌"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {
                  rules: [{ required: true, message: '请选择品牌' }],
                })(
                  <Select placeholder="请选择品牌">
                    <Option value="uniqlo">优衣库</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={6}>
              <FormItem
                label="开始销售时间"
                {...formItemLayout}
              >
                {getFieldDecorator('startDateStr', {
                  rules: [{ required: true, message: '请选择开始销售时间' }],
                })(
                  <DatePicker placeholder="请选择开始销售时间" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="结束销售时间"
                {...formItemLayout}
              >
                {getFieldDecorator('endDateStr', {
                  rules: [{ required: true, message: '请选择结束销售时间' }],
                })(
                  <DatePicker placeholder="请选择结束销售时间" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={5} push={3}>
              <Button htmlType="submit" size="large" type="primary">查询</Button>
            </Col>
            <Col span={4}>
              <Button size="large" type="ghost">清空</Button>
            </Col>
          </Row>
          <Row className={styles.plus}>
            <Col>
              <Button type="primary" size="large" onClick={this.showModal.bind(this)}>添加</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table
                columns={columns}
                dataSource={productsList.data}
                bordered
                size="large"
                rowKey={record => record.id}
                pagination={{ total: productsList.totalCount, pageSize: 10 }}
              />
            </Col>
          </Row>
        </Form>
        <ProductsModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
        />
      </div>
    );

  }

}

function mapStateToProps(state) {
  const { productsList } = state.products;
  return {
    loading: state.loading.models.products,
    productsList: productsList,
  };
}

Products.PropTypes = {
  productsList: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
};

Products = Form.create()(Products);

export default connect(mapStateToProps)(Products);
