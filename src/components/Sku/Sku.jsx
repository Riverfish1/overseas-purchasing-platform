import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input, Popconfirm, Select, TreeSelect } from 'antd';
import SkuModal from './SkuModal';
import styles from './Sku.less';

const FormItem = Form.Item;
const Option = Select.Option;

class Sku extends Component {

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
      this.props.dispatch({
        type: 'sku/querySkuList',
        payload: {
          ...fieldsValue,
        },
      });
    });
  }

  handleEmpty() {
    const { resetFields } = this.props.form;
    resetFields();
  }

  handleDelete(id) {
    this.props.dispatch({
      type: 'sku/deleteSku',
      payload: { id },
    });
  }

  updateModal(id) {
    this.setState({
      modalVisible: true,
    }, () => {
      this.props.dispatch({
        type: 'sku/querySku',
        payload: { id },
      });
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
    });
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    }, () => {
      this.props.dispatch({
        type: 'sku/saveSku',
        payload: {},
      });
    });
  }

  render() {
    const p = this;
    const { skuList = {}, currentPage, skuData, brands = [], productsList = [], form, tree = [], packageScales } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: 'SKU条码', dataIndex: 'skuCode', key: 'skuCode' },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName' },
      { title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        render(text) {
          return text || '-';
        },
      },
      { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName', render(text) { return text || '-'; } },
      { title: '尺寸', dataIndex: 'scale', key: 'scale', render(text) { return text || '-'; } },
      { title: '颜色', dataIndex: 'color', key: 'color', render(text) { return text || '-'; } },
      { title: '虚拟库存', dataIndex: 'virtualInv', key: 'virtualInv', render(text) { return text || '-'; } },
      { title: '重量', dataIndex: 'weight', key: 'weight', render(text) { return text || '-'; } },
      { title: '运费', dataIndex: 'freightStr', key: 'freightStr', render(text) { return text || '-'; } },
      { title: '修改时间', dataIndex: 'gmtModify', key: 'gmtModify', render(text) { return text || '-'; } },
      {
        title: '操作',
        dataIndex: 'oper',
        key: 'oper',
        width: 80,
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={p.updateModal.bind(p, record.id)}>修改</a>
              <Popconfirm title="确定删除此类目？" onConfirm={p.handleDelete.bind(p, record.id)}>
                <a href="javascript:void(0)" >删除</a>
              </Popconfirm>
            </div>);
        },
      },
    ];

    const paginationProps = {
      total: skuList && skuList.totalCount,
      pageSize: 10,
      current: currentPage,
      onChange(pageIndex) {
        p.props.dispatch({
          type: 'sku/querySkuList',
          payload: { pageIndex },
        });
      },
    };

    return (
      <div className={styles.normal}>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 700 }}>
            <Col span="8">
              <FormItem
                label="商品编码"
                {...formItemLayout}
              >
                {getFieldDecorator('itemCode', {})(
                  <Input placeholder="请输入商品编码" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="SKU编码"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {})(
                  <Input placeholder="请输入sku编码" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品名称"

                {...formItemLayout}
              >
                {getFieldDecorator('itemName', {})(
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
            <Col span={8}>
              <FormItem
                label="品牌"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {})(
                  <Select placeholder="请选择品牌">
                    {brands && brands.map(item => <Option key={item.name} value={item.name}>{item.name}</Option>)}
                  </Select>)}
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
            <Button type="primary" size="large" onClick={this.showModal.bind(this)}>添加</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={skuList.data}
              bordered
              rowKey={record => record.id}
              pagination={paginationProps}
            />
          </Col>
        </Row>
        <SkuModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={skuData}
          brands={brands}
          productsList={productsList}
          packageScales={packageScales}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { skuList, skuData, currentPage, packageScales } = state.sku;
  const { brands, productsList, tree } = state.products;
  return {
    // loading: state.loading.models.sku,
    skuList,
    skuData,
    currentPage,
    packageScales,
    brands: brands.data,
    productsList: productsList.rows,
    tree: tree.data,
  };
}

Sku.PropTypes = {
  skuList: PropTypes.object.isRequired,
  skuData: PropTypes.object.isRequired,
  current: PropTypes.number.isRequired,
  brands: PropTypes.array.isRequired,
  productsList: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(Form.create()(Sku));
