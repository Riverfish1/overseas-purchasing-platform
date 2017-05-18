import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Select, DatePicker, Form, TreeSelect, Modal, Popover } from 'antd';
import ProductsModal from './ProductsModal';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Products extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
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

  updateModal(id) {
    const p = this;
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
      previewImage: value,
    });
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

  interator(arr, value, data = []) {
    const p = this;
    arr.forEach((el) => {
      if (el.id.toString() === value) data.push(el);
      else if (el.children.length) p.interator(el.children, value, data);
    });
    return data;
  }

  chooseCate(rules, value, cb) {
    const { tree } = this.props;
    const data = this.interator(tree, value);
    if (data && data[0] && data[0].level !== 3) cb('只能选择最后一级类目');
    cb();
  }

  render() {
    const p = this;
    const { form, currentPage, productsList = [], productsTotal, brands = [], productsValues = {}, tree = [] } = this.props;
    const { getFieldDecorator, resetFields } = form;
    const { previewImage, isNotSelected } = this.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const content = (
      <img role="presentation" src={previewImage} style={{ width: 400 }} />
    );
    const yzBasicUrl = 'https://h5.youzan.com/v2/goods/';
    const columns = [
      { title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        render(t, r) {
          return r.outerAlias ? <a href={`${yzBasicUrl}${r.outerAlias}`} rel="noopener noreferrer" target="_blank">{t}</a> : <span>{t}</span>;
        },
      },
      { title: '商品代码', dataIndex: 'itemCode', key: 'itemCode', width: 100 },
      { title: '商品状态',
        dataIndex: 'status',
        key: 'status',
        width: 60,
        render(t) {
          switch (t) {
            case 0: return '新建';
            case 1: return '上架';
            case 2: return '下架';
            case 3: return '同步';
            case -1: return '删除';
            default: return false;
          }
        },
      },
      { title: '商品图片',
        dataIndex: 'mainPic',
        key: 'mainPic',
        width: 80,
        render(text) {
          let imgUrl = '';
          try {
            const imgObj = JSON.parse(text);
            imgUrl = imgObj.picList[parseInt(imgObj.mainPicNum, 10) - 1].url;
          } catch (e) {
            return '-';
          }
          return (
            <Popover title={null} content={content}>
              <img role="presentation" onMouseEnter={p.handleBigPic.bind(p, imgUrl)} src={imgUrl} width="50" height="50" />
            </Popover>);
        },
      },
      { title: '商品品牌',
        dataIndex: 'brand',
        key: 'brand',
        width: 100,
        render(text) { return text || '-'; },
      },
      { title: '销售类型', dataIndex: 'saleType', key: 'saleType', width: 80, render(text) { return <span>{text === 0 ? '代购' : '现货' }</span>; } },
      { title: '商品类目',
        width: 100,
        dataIndex: 'categoryId',
        key: 'categoryId',
        render(t) {
          const cate = p.interator(tree, t && t.toString()) || [];
          return <span>{cate[0] ? cate[0].name : '-'}</span>;
        },
      },
      { title: '采购地点', dataIndex: 'buySite', key: 'buySite', width: 80, render(text) { return text || '-'; } },
      { title: '开始销售时间', dataIndex: 'startDate', key: 'startDate', width: 80, render(text) { return text ? text.split(' ')[0] : '-'; } },
      { title: '结束销售时间', dataIndex: 'endDate', key: 'endDate', width: 80, render(text) { return text ? text.split(' ')[0] : '-'; } },
      { title: '操作',
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
                {getFieldDecorator('categoryId', {
                  rules: [{ validator: this.chooseCate.bind(this) }],
                })(
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
                  <Select placeholder="请选择品牌" combobox>
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
              <Button size="large" type="ghost" onClick={() => resetFields()}>清空</Button>
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
              scroll={{ x: '130%' }}
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
