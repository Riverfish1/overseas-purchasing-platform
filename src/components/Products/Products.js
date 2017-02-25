import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Pagination, Input, Button, message, Row, Col, Select, DatePicker, Form, Icon, TreeSelect } from 'antd';
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
      updateId: [], // 修改商品传的id
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
        'startGmt': filedsValue['startGmt'] && filedsValue['startGmt'].format('YYYY-MM-DD'),
        'endGmt': filedsValue['endGmt'] && filedsValue['endGmt'].format('YYYY-MM-DD'),
      };
      console.log(values);
      this.props.dispatch({
        type: 'products/queryItemList',
        payload: { ...values },
      });
    });
  }

  addModal() {
    this.setState({
      modalVisible: true,
    });
  }

  handleEmpty() {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      itemCode: '',
      name: '',
      categoryId: [],
      brand: [],
      startDate: '',
      endDate: '',
    });
  }

  updateModal(id) {
    let p = this;
    console.log(id);
    if (id.length === 1) {
      this.setState({
        modalVisible: true,
      }, () => {
        p.props.dispatch({ type: 'products/queryProduct', payload: { id: id[0] } });
      });
    } else {
      message.error('至少选择一个，且只能选择一个进行修改');
    }
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
  }

  render() {
    let p = this;
    const { form, productsList = {}, brands = [], productsValues = {}, tree=[], } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
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
    const rowSelection = {
      getCheckboxProps: record => ({}),
      onChange(selectedRowKeys) {
        p.setState({ updateId: selectedRowKeys });
      },
    };

    const paginationProps = {
      total: productsList && productsList.total,
      pageSize: 10,
      onChange(page) {
        p.props.dispatch({
          type: 'products/queryItemList',
          payload: { page },
        });
      },
    };

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
                  rules: [{ message: '请输入商品编码' }],
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
                  rules: [{ message: '请输入商品名称' }],
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
                  rules: [{ message: '请选择类目' }],
                })(
                  <TreeSelect placeholder="请选择类目" treeData={tree} />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="品牌"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {
                  rules: [{ message: '请选择品牌' }],
                })(
                  <Select placeholder="请选择品牌">
                    {brands && brands.map((item, index) => {
                      return <Option key={item.name}>{item.name}</Option>
                    } )}
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
                {getFieldDecorator('startDate', {
                  rules: [{ message: '请选择开始销售时间' }],
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
                {getFieldDecorator('endDate', {
                  rules: [{ message: '请选择结束销售时间' }],
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
              <Button size="large" type="ghost" onClick={this.handleEmpty.bind(this)}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row className={styles.plus}>
          <Col span={3}>
            <Button type="primary" size="large" onClick={this.addModal.bind(this)}>添加商品</Button>
          </Col>
          <Col span={3}>
            <Button size="large" onClick={this.updateModal.bind(this, p.state.updateId)}>修改商品</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={productsList && productsList.rows}
              bordered
              size="large"
              rowKey={record => record.id}
              rowSelection={rowSelection}
              pagination={paginationProps}
            />
          </Col>
        </Row>
        <ProductsModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={productsValues}
          brands={brands}
          tree={tree}
        />
      </div>
    );

  }

}

function mapStateToProps(state) {
  const { productsList, productsValues, brands, tree } = state.products;
  return {
    loading: state.loading.models.products,
    productsList,
    productsValues,
    brands: brands.data,
    tree: tree.data,
  };
}

Products.PropTypes = {
  productsList: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  brands: PropTypes.array.isRequired,
  productsValues: PropTypes.object.isRequired,
};

Products = Form.create()(Products);

export default connect(mapStateToProps)(Products);
