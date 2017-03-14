import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Select, DatePicker, Form, TreeSelect, Modal } from 'antd';
import ProductsModal from './ProductsModal';
import styles from './Products.less';

const FormItem = Form.Item;
const Option = Select.Option;

class Products extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      previewVisible: false,
      previewImage: '',
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      console.log(values);
      this.props.dispatch({
        type: 'products/queryItemList',
        payload: { ...values, pageIndex: 1 },
      });
    });
  }

  addModal() {
    this.setState({
      modalVisible: true,
    });
  }

  handleEmpty() {
    const { resetFields } = this.props.form;
    resetFields();
  }

  updateModal(id) {
    const p = this;
    console.log(id);
    this.setState({
      modalVisible: true,
    }, () => {
      p.props.dispatch({ type: 'products/queryProduct', payload: { id } });
    });
  }

  closeModal(modalVisible) {
    const { dispatch } = this.props;

    this.setState({
      modalVisible,
    });

    dispatch({
      type: 'products/saveProductsValue',
      payload: {},
    });
  }

  handleBigPic(value) {
    this.setState({
      previewVisible: true,
      previewImage: value,
    });
  }

  handleCancel() {
    this.setState({ previewVisible: false });
  }

  render() {
    const p = this;
    const { form, currentPage, productsList = {}, brands = [], productsValues = {}, tree = [] } = this.props;
    const { getFieldDecorator } = form;
    const { previewImage, previewVisible } = this.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      {
        title: '商品名称', dataIndex: 'name', key: 'name',
      },
      {
        title: '商品代码', dataIndex: 'itemCode', key: 'itemCode',
      },
      {
        title: '商品图片',
        dataIndex: 'mainPic',
        key: 'mainPic',
        width: 66,
        render(text) {
          let imgUrl = '';
          try {
            const imgObj = JSON.parse(text.replace(/&quot;/g, '"'));
            imgUrl = imgObj.picList[0].url;
          } catch (e) {
            return '-';
          }
          return <img role="presentation" onClick={p.handleBigPic.bind(p, imgUrl)} src={imgUrl} width="50" height="50" style={{ cursor: 'pointer' }} />;
        },
      },
      {
        title: '商品品牌',
        dataIndex: 'brand',
        key: 'brand',
        render(text) {
          let res = '-';
          if (text && brands) {
            const arr = brands.filter(el => el.id.toString() === text.toString());
            if (arr && arr.length > 0) res = arr[0].name;
          }
          return res;
        },
      },
      {
        title: '销售类型', dataIndex: 'saleType', key: 'saleType', render(text) { return <span>{text === '0' ? '代购' : '现货' }</span>; },
      },
      {
        title: '商品类目',
        dataIndex: 'categoryId',
        key: 'categoryId',
        render(text) {
          let cate = '-';
          tree.forEach((item) => {
            if (item.id === text) {
              cate = item.name;
            }
            if (item.children) {
              item.children.forEach((key) => {
                if (key.id === text) {
                  cate = key.name;
                }
              });
            }
          });
          return <span>{cate}</span>;
        },
      },
      {
        title: '采购地点', dataIndex: 'buySite', key: 'buySite', render(text) { return text || '-'; },
      },
      {
        title: '开始销售时间', dataIndex: 'startDate', key: 'startDate', render(text) { return text ? text.split(' ')[0] : '-'; },
      },
      {
        title: '结束销售时间', dataIndex: 'endDate', key: 'endDate', render(text) { return text ? text.split(' ')[0] : '-'; },
      },
      {
        title: '操作',
        dataIndex: 'oper',
        key: 'oper',
        width: 50,
        render(text, record) {
          return (
            <a onClick={p.updateModal.bind(p, record.id)}>修改</a>
          );
        },
      },
    ];

    const paginationProps = {
      total: productsList && productsList.total,
      pageSize: 10,
      current: currentPage,
      onChange(pageIndex) {
        const values = p.props.form.getFieldsValue();
        const payload = {};
        Object.keys(values).forEach((key) => {
          if (values[key]) payload[key] = values[key];
        });
        p.props.dispatch({
          type: 'products/queryItemList',
          payload: { ...payload, pageIndex },
        });
      },
    };

    return (
      <div className={styles.normal}>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 700 }}>
            <Col span="8">
              <FormItem
                label="商品代码"

                {...formItemLayout}
              >
                {getFieldDecorator('itemCode', {})(
                  <Input placeholder="请输入商品代码" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品名称"

                {...formItemLayout}
              >
                {getFieldDecorator('name', {})(
                  <Input placeholder="请输入商品名称" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品类目"
                {...formItemLayout}
              >
                {getFieldDecorator('categoryId', {})(
                  <TreeSelect placeholder="请选择类目" treeData={tree} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 700 }}>
            <Col span={8}>
              <FormItem
                label="品牌"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {})(
                  <Select placeholder="请选择品牌">
                    {brands && brands.map(item => <Option key={item.name}>{item.name}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="开始销售时间"
                {...formItemLayout}
              >
                {getFieldDecorator('startGmt', {})(<DatePicker placeholder="请选择开始时间" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="结束销售时间"
                {...formItemLayout}
              >
                {getFieldDecorator('endGmt', {})(
                  <DatePicker placeholder="请选择结束时间" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={this.handleEmpty.bind(this)}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col className="operBtn">
            <Button type="primary" size="large" onClick={this.addModal.bind(this)}>添加商品</Button>
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
        <Modal visible={previewVisible} title="预览图片" footer={null} onCancel={this.handleCancel.bind(this)}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { productsList, productsValues, brands, tree, currentPage } = state.products;
  return {
    loading: state.loading.models.products,
    productsList,
    productsValues,
    currentPage,
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

export default connect(mapStateToProps)(Form.create()(Products));
