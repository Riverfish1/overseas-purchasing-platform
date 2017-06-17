import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input, InputNumber, Popconfirm, Popover, Select, TreeSelect, Modal } from 'antd';
import SkuModal from './SkuModal';

const FormItem = Form.Item;
const Option = Select.Option;

@window.regStateCache
class Sku extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      previewVisible: false,
      previewImage: '',
      lockedNumGroup: {},
      lockedPopoverVisible: {},
    };
  }

  handleSubmit(e, page) {
    if (e) e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      this.props.dispatch({
        type: 'sku/querySkuList',
        payload: { ...fieldsValue, pageIndex: typeof page === 'number' ? page : 1 },
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

  handleCancel() {
    this.setState({ previewVisible: false });
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

  handleBigPic(value) {
    this.setState({
      previewVisible: true,
      previewImage: value,
    });
  }

  toggleLockedPopoverVisible(record) {
    const { lockedPopoverVisible } = this.state;
    lockedPopoverVisible[record.id] = !lockedPopoverVisible[record.id];
    this.setState({ lockedPopoverVisible });
  }

  updateLockedSku(record) {
    const { lockedNumGroup } = this.state;
    const num = lockedNumGroup[record.id];
    if (!num) {
      Modal.warning({ title: '请输入锁定库存数量' });
      return;
    }
    this.toggleLockedPopoverVisible(record);
    lockedNumGroup[record.id] = undefined;
    this.setState({ lockedNumGroup }, () => {
      this.props.dispatch({
        type: 'sku/lockVirtualInv',
        payload: {
          lockedVirtualInv: num,
          itemId: record.itemId,
          id: record.id,
        },
      });
    });
  }

  render() {
    const p = this;
    const { skuList = {}, skuTotal, skuData, brands = [], productsList = [], form, tree = [], packageScales } = this.props;
    const { previewImage } = this.state;
    const { getFieldDecorator } = form;

    const content = (
      <img role="presentation" src={previewImage} style={{ width: 400 }} />
    );
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 100 },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 200 },
      { title: '商品代码', dataIndex: 'itemCode', key: 'itemCode', width: 100 },
      { title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width: 100,
        render(text) {
          return text || '-';
        },
      },
      {
        title: 'sku图片',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: 100,
        render(text) {
          let imgUrl = '';
          try {
            const imgObj = JSON.parse(text);
            imgUrl = imgObj.picList[0].url;
          } catch (e) {
            return '-';
          }
          return (
            <Popover title={null} content={content}>
              <img role="presentation" onMouseEnter={p.handleBigPic.bind(p, imgUrl)} src={imgUrl} width="50" height="50" />
            </Popover>
          );
        },
      },
      { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName', width: 80, render(text) { return text || '-'; } },
      { title: '尺寸', dataIndex: 'scale', key: 'scale', width: 50, render(text) { return text || '-'; } },
      { title: '颜色', dataIndex: 'color', key: 'color', width: 100, render(text) { return text || '-'; } },
      { title: '销售价格(元)', dataIndex: 'salePrice', key: 'salePrice', width: 100, render(text) { return text || '-'; } },
      { title: '库存',
        key: 'inve',
        width: 100,
        render(t, r) {
          return (
            <div>
              可售库存：{r.totalAvailableInv}<br />
              虚拟库存：{r.virtualInv}<br />
              虚拟预扣：{r.lockedVirtualInv}<br />
              现货库存：{r.inventory}<br />
              现货占用：{r.lockedInv}<br />
              在途库存：{r.transInv}<br />
              在途占用：{r.lockedTransInv}
            </div>
          );
        },
      },
      { title: '重量(kg)', dataIndex: 'weight', key: 'weight', width: 80, render(text) { return text || '-'; } },
      { title: '运费', dataIndex: 'freightStr', key: 'freightStr', width: 60, render(text) { return text || '-'; } },
      { title: '修改时间', dataIndex: 'gmtModify', key: 'gmtModify', width: 100, render(text) { return text || '-'; } },
      {
        title: '操作',
        dataIndex: 'oper',
        key: 'oper',
        width: 110,
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={p.updateModal.bind(p, record.id)}>修改</a>
              <Popconfirm title="确定删除此类目？" onConfirm={p.handleDelete.bind(p, record.id)}>
                <a href="javascript:void(0)" >删除</a>
              </Popconfirm>&nbsp;&nbsp;
              <Popover
                content={<div>
                  <div>商品名称：{record.itemName}</div>
                  <div style={{ paddingTop: 6 }}>锁定数量：<InputNumber placeholder="请输入" step={1} value={p.state.lockedNumGroup[record.id] || undefined} onChange={(v) => { p.state.lockedNumGroup[record.id] = v; p.setState({ lockedNumGroup: p.state.lockedNumGroup }); }} /></div>
                  <Button size="small" type="primary" style={{ marginTop: 6 }} onClick={p.updateLockedSku.bind(p, record)}>保存</Button>
                </div>}
                title="锁定库存"
                trigger="click"
                visible={p.state.lockedPopoverVisible[record.id] || false}
                onVisibleChange={p.toggleLockedPopoverVisible.bind(p, record)}
              >
                <a href="javascript:void(0)" style={{ marginRight: 10 }}>锁定</a>
              </Popover>
            </div>);
        },
      },
    ];

    const paginationProps = {
      total: skuTotal,
      pageSize: 20,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
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
                label="SKU代码"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {})(
                  <Input placeholder="请输入SKU代码" />)}
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
                  <Select placeholder="请选择品牌" combobox>
                    {brands && brands.map(item => <Option key={item.name} value={item.name}>{item.name}</Option>)}
                  </Select>)}
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
          <Col className="operBtn" style={{ paddingTop: 0, paddingBottom: 5, border: 'none' }}>
            {/* <Button type="primary" size="large" onClick={this.showModal.bind(this)}>添加</Button> */}
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={skuList}
              bordered
              rowKey={record => record.id}
              pagination={paginationProps}
              scroll={{ y: 500 }}
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
  const { skuList, skuTotal, skuData, packageScales } = state.sku;
  const { brands, productsList, tree } = state.products;
  return {
    skuList,
    skuTotal,
    skuData,
    packageScales,
    brands,
    productsList,
    tree,
  };
}

export default connect(mapStateToProps)(Form.create()(Sku));
