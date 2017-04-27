import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Select, DatePicker, Form, TreeSelect, Modal } from 'antd';
import ProductsModal from './ProductsModal';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Products extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      previewVisible: false,
      previewImage: '',
      isNotSelected: true,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (values.saleDate) {
        values.startDate = new Date(values.saleDate[0]).format('yyyy-MM-dd');
        values.endDate = new Date(values.saleDate[1]).format('yyyy-MM-dd');
        delete values.saleDate;
      }
      this.props.dispatch({
        type: 'products/saveSearchValues',
        payload: { ...values },
      });
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

  batchAction(batchType) {
    const p = this;
    const { checkId } = this.state;
    let action = '';
    let type = '';
    switch (batchType) {
      case 'syn': action = '同步'; type = 'products/batchSynItemYouzan'; break;
      case 'onSell': action = '上架'; type = 'products/batchListingYouzan'; break;
      case 'offSell': action = '下架'; type = 'products/batchDelistingYouzan'; break;
      default: action = '';
    }
    Modal.confirm({
      title: '确定',
      content: `确定要${action}id为${JSON.stringify(checkId)}的产品吗？`,
      onOk() {
        p.props.dispatch({ type, payload: { itemIds: JSON.stringify(checkId) } });
      },
    });
  }

  render() {
    const p = this;
    const { form, currentPage, productsList = [], productsTotal, brands = [], productsValues = {}, tree = [] } = this.props;
    const { getFieldDecorator } = form;
    const { previewImage, previewVisible, isNotSelected } = this.state;
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
            const imgObj = JSON.parse(text);
            imgUrl = imgObj.picList[parseInt(imgObj.mainPicNum, 10) - 1].url;
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
          return text || '-';
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
      total: productsTotal,
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

    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        const listId = [];
        if (selectedRows.length) p.setState({ isNotSelected: false });
        else p.setState({ isNotSelected: true });
        selectedRows.forEach((el) => {
          listId.push(el.id);
        });
        p.setState({ checkId: listId });
      },
    };

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
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
          <Row gutter={20} style={{ width: 800 }}>
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
          </Row>
          <Row gutter={20} style={{ width: 800, marginLeft: -6 }}>
            <Col>
              <FormItem
                label="销售时间范围"
                {...formItemLayout}
                labelCol={{ span: 3 }}
              >
                {getFieldDecorator('saleDate')(<RangePicker />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginLeft: 13 }}>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={this.handleEmpty.bind(this)}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col className="operBtn" span={18}>
            <Button type="primary" size="large" onClick={this.addModal.bind(this)}>添加商品</Button>
          </Col>
          <Col className="operBtn" span={2}>
            <Button type="primary" disabled={isNotSelected} size="large" onClick={p.batchAction.bind(p, 'syn')}>批量同步</Button>
          </Col>
          <Col className="operBtn" span={2}>
            <Button type="primary" disabled={isNotSelected} size="large" onClick={p.batchAction.bind(p, 'onSell')}>批量上架</Button>
          </Col>
          <Col className="operBtn" span={2}>
            <Button type="primary" disabled={isNotSelected} size="large" onClick={p.batchAction.bind(p, 'offSell')}>批量下架</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={productsList}
              bordered
              size="large"
              rowKey={record => record.id}
              pagination={paginationProps}
              rowSelection={rowSelection}
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
  const { productsList, productsTotal, productsValues, brands, tree, currentPage } = state.products;
  return {
    productsList,
    productsTotal,
    productsValues,
    currentPage,
    brands,
    tree,
  };
}

export default connect(mapStateToProps)(Form.create()(Products));
