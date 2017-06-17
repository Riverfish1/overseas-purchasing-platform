import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Button, Input, Popover } from 'antd';

import TransTo from './components/trans-to';
import CheckIn from './components/check-in';
import CheckOut from './components/check-out';

const FormItem = Form.Item;

@window.regStateCache
class Inventory extends Component {
  constructor() {
    super();
    this.state = {
      previewImage: null,
    };
  }
  handleSubmit(e, page) {
    if (e) e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: 'inventory/queryList',
        payload: { ...values, pageIndex: typeof page === 'number' ? page : 1 },
      });
    });
  }
  handleBigPic(value) {
    this.setState({
      previewVisible: true,
      previewImage: value,
    });
  }
  render() {
    const p = this;
    const { list = [], total, form, dispatch } = this.props;
    const { previewImage } = this.state;
    const { getFieldDecorator, resetFields } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const content = (
      <img role="presentation" src={previewImage} style={{ width: 400 }} />
    );
    const columns = [
      { title: 'SKU代码', key: 'skuCode', dataIndex: 'skuCode', width: 150 },
      { title: '商品名称', key: 'itemName', dataIndex: 'itemName', width: 200 },
      {
        title: '商品图片',
        key: 'skuPic',
        dataIndex: 'skuPic',
        width: 88,
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
      { title: '仓库名称', key: 'warehouseName', dataIndex: 'warehouseName', width: 100 },
      { title: 'UPC', key: 'upc', dataIndex: 'upc', width: 100 },
      { title: '可售库存', key: 'totalAvailableInv', dataIndex: 'totalAvailableInv', width: 80 },
      { title: '现货库存', key: 'inventory', dataIndex: 'inventory', width: 80 },
      { title: '现货占用', key: 'lockedInv', dataIndex: 'lockedInv', width: 80 },
      // { title: '虚拟库存', key: 'virtualInv', dataIndex: 'virtualInv' },
      { title: '在途库存', key: 'transInv', dataIndex: 'transInv', width: 80 },
      { title: '在途占用', key: 'lockedTransInv', dataIndex: 'lockedTransInv', width: 80 },
      { title: '货架号', key: 'positionNo', dataIndex: 'positionNo', width: 60 },
      {
        title: '操作',
        dataIndex: 'oper',
        key: 'oper',
        width: 200,
        render(text, record) {
          return (
            <div>
              <TransTo dispatch={dispatch} record={record} form={form} />
              <CheckIn dispatch={dispatch} record={record} form={form} />
              <CheckOut dispatch={dispatch} record={record} />
            </div>
          );
        },
      },
    ];
    const paginationProps = {
      total,
      pageSize: 20,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
      },
    };
    return (
      <div>
        <Form onSubmit={p.handleSubmit.bind(p)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="仓库名称"
                {...formItemLayout}
              >
                {getFieldDecorator('warehouseName', {})(
                  <Input placeholder="请输入仓库名称" />,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="SKU代码"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {})(
                  <Input placeholder="请输入SKU代码" />,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="UPC"
                {...formItemLayout}
              >
                {getFieldDecorator('upc', {})(
                  <Input placeholder="请输入UPC" />,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('itemName', {})(
                  <Input placeholder="请输入商品名称" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginLeft: 13 }}>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={() => { resetFields(); }}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row style={{ marginTop: 15 }}>
          <Col>
            <Table
              bordered
              dataSource={list}
              columns={columns}
              pagination={paginationProps}
              rowKey={record => record.id}
              scroll={{ y: 500 }}
            />
          </Col>
        </Row>
      </div>);
  }
}

function mapStateToProps(state) {
  const { list, total } = state.inventory;
  return { list, total };
}

export default connect(mapStateToProps)(Form.create()(Inventory));
