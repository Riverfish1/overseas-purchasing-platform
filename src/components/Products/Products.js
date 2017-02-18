import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Pagination, Input, Button, Row, Col, Select, DatePicker, Form, Icon } from 'antd';
import ProductsModal from './ProductsModal';
import styles from './Products.less';

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
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      
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
        render(record, index) {
          return index + 1;
        },
      },
      {
        title: '商品名称', dataIndex: 'productsName', key: 'productsName', 
      },
      {
        title: '商品代码', dataIndex: 'productsCode', key: 'productsCode', 
      },
      {
        title: '商品图片', dataIndex: 'productsImage', key: 'productsImage', 
      },
      {
        title: '商品品牌', dataIndex: 'productsBrand', key: 'productsBrand', 
      },
      {
        title: '销售类型', dataIndex: 'salesType', key: 'salesType', 
      },
      {
        title: '商品类目', dataIndex: 'productsCategory', key: 'productsCategory', 
      },
      {
        title: '采购地点', dataIndex: 'purchaseDest', key: 'purchaseDest', 
      },
      {
        title: '开始销售时间', dataIndex: 'startTime', key: 'startTime', 
      },
      {
        title: '结束销售时间', dataIndex: 'endTime', key: 'endTime', 
      },
    ];

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { dataSource, form } = this.props;
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
                {getFieldDecorator('productCode', {
                  rules: [{ required: true, message: '请输入商品编码' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('productName', {
                  rules: [{ required: true, message: '请输入商品名称' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="英文名称"
                {...formItemLayout}
              >
                {getFieldDecorator('enName', {
                  rules: [{ required: true, message: '请输入英文名称' }],
                })(
                  <Input />
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
                {getFieldDecorator('category', {
                  rules: [{ required: true, message: '请输入类目' }],
                })(
                  <Select />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="品牌"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {
                  rules: [{ required: true, message: '请输入品牌' }],
                })(
                  <Select />
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
                {getFieldDecorator('category', {
                  rules: [{ required: true, message: '请输入开始销售时间' }],
                })(
                  <DatePicker />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="结束销售时间"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {
                  rules: [{ required: true, message: '请输入结束销售时间' }],
                })(
                  <DatePicker />
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
              <Button onClick={this.showModal.bind(this)}>添加</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                size="large"
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
  const { dataSource } = state.products;
  return {
    loading: state.loading.models.products,
    dataSource,
  };
}

Products.PropTypes = {
  dataSource: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
};

Products = Form.create()(Products);

export default connect(mapStateToProps)(Products);
