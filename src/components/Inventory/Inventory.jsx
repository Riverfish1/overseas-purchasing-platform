import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Button, Input } from 'antd';

const FormItem = Form.Item;

class Inventory extends Component {

  handleSubmit(e) {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: 'inventory/queryList',
        payload: { ...values, pageIndex: 1 },
      });
    });
  }
  render() {
    const p = this;
    const { list = [], total, form } = this.props;
    const { getFieldDecorator, resetFields } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: 'SKU代码', key: 'skuCode', dataIndex: 'skuCode' },
      { title: '商品名称', key: 'itemName', dataIndex: 'itemName' },
      { title: '商品图片', key: 'skuPic', dataIndex: 'skuPic' },
      { title: '仓库名称', key: 'warehouseName', dataIndex: 'warehouseName' },
      { title: 'UPC', key: 'upc', dataIndex: 'upc' },
      { title: '实际库存', key: 'inventory', dataIndex: 'inventory' },
      { title: '虚拟库存', key: 'virtualInv', dataIndex: 'virtualInv' },
      { title: '在途库存', key: 'transInv', dataIndex: 'transInv' },
      { title: '可售库存', key: 'availableInv', dataIndex: 'availableInv' },
      { title: '占用库存', key: 'lockedInv', dataIndex: 'lockedInv' },
      { title: '货架号', key: 'positionNo', dataIndex: 'positionNo' },
    ];
    const paginationProps = {
      total,
      pageSize: 10,
      onChange(page) {
        p.props.dispatch({
          type: 'inventory/queryList',
          payload: { pageIndex: page },
        });
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
            <Table bordered dataSource={list} columns={columns} pagination={paginationProps} rowKey={record => record.id} />
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
