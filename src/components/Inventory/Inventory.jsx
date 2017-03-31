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
      { title: '商品sku', key: 'skuCode', dataIndex: 'skuCode' },
      { title: '商品名称', key: 'itemName', dataIndex: 'itemName' },
      { title: '商品图片', key: 'skuPic', dataIndex: 'skuPic' },
      { title: '仓库名称', key: 'warehouseName', dataIndex: 'warehouseName' },
      { title: 'upc', key: 'upc', dataIndex: 'upc' },
      { title: '包裹号', key: 'positionNo', dataIndex: 'positionNo' },
      { title: '在途库存', key: 'inventory', dataIndex: 'inventory' },
      { title: '转换库存', key: 'transInv', dataIndex: 'transInv' },
      { title: '实际库存', key: 'availableInv', dataIndex: 'availableInv' },
      { title: '占用数量', key: 'lockedInv', dataIndex: 'lockedInv' },
    ];
    const paginationProps = {
      total,
      pageSize: 10,
    };
    return (
      <div>
        <Form onSubmit={p.handleSubmit.bind(p)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="商品ID"
                {...formItemLayout}
              >
                {getFieldDecorator('itemId', {})(
                  <Input placeholder="请输入商品ID" />,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="skuId"
                {...formItemLayout}
              >
                {getFieldDecorator('skuId', {})(
                  <Input placeholder="请输入skuId" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={() => { resetFields(); }}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Table dataSource={list} columns={columns} pagination={paginationProps} rowKey={record => record.id} />
      </div>);
  }
}

function mapStateToProps(state) {
  const { list, total } = state.inventory;
  return { list, total };
}

export default connect(mapStateToProps)(Form.create()(Inventory));
