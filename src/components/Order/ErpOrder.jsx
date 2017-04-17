import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Input, Select, Button, Modal } from 'antd';

import styles from './Order.less';

const FormItem = Form.Item;
const Option = Select.Option;


class ErpOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNotSelected: true,
      checkId: [], // 发货时传的ID
      visible: false,
      needSplitId: '',
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'order/queryErpOrderList',
        payload: { ...fieldsValue, pageIndex: 1 },
      });
    });
  }
  multiDelivery() { // 批量发货
    const p = this;
    Modal.confirm({
      title: '确认发货',
      content: `确认要对id为“${this.state.checkId.join(', ')}”的订单进行发货吗？`,
      onOk() {
        p.props.dispatch({
          type: 'order/multiDelivery',
          payload: { ids: JSON.stringify(p.state.checkId) },
        });
      },
    });
  }
  splitOrder() {
    const p = this;
    console.log(p);
    const num = p.num.refs.input.value;
    this.props.dispatch({
      type: 'order/splitOrder',
      payload: { id: p.state.needSplitId, num },
      success(data) {
        if (data.success) {
          p.handleCancel();
          p.props.dispatch({
            type: 'order/queryErpOrderList',
            payload: {},
          });
        }
      },
    });
  }
  handleCancel() {
    this.num.refs.input.value = '';
    this.setState({ visible: false });
  }
  render() {
    const p = this;
    const { erpOrderList, form } = p.props;
    const { getFieldDecorator, resetFields } = form;
    const { isNotSelected, visible } = p.state;

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        const listId = [];
        selectedRows.length ? p.setState({ isNotSelected: false }) : p.setState({ isNotSelected: true });
        selectedRows.forEach((el) => {
          listId.push(el.id);
        });
        p.setState({ checkId: listId });
      },
    };
    const columns = [
      { title: 'erp订单号', dataIndex: 'erpNo', key: 'erpNo', width: '12%' },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: '12%' },
      { title: '外部订单号', dataIndex: 'outerNo', key: 'outerNo', width: '10%', render(text) { return text || '-'; } },
      { title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        width: '6%',
        render(text) {
          switch (text) {
            case 0: return '未发货';
            case 3: return '已发货';
            case -1: return '已关闭';
            default: return '-';
          }
        },
      },
      {
        title: '备货状态',
        dataIndex: 'stockStatus',
        key: 'stockStatus',
        width: '6%',
        render(text) {
          switch (text) {
            case 0: return '未备货';
            case 1: return '部分备货';
            case 2: return '部分在途备货';
            case 3: return '全部在途备货';
            case 4: return '已备货';
            default: return '-';
          }
        },
      },
      { title: '收件人', dataIndex: 'receiver', key: 'receiver', width: '6%' },
      { title: '收件人地址',
        dataIndex: 'address',
        key: 'address',
        width: '10%',
        render(text, record) {
          return <span>{text ? `${text} ${record.addressDetail}` : '-'}</span>;
        },
      },
      { title: '联系电话', dataIndex: 'telephone', key: 'telephone', width: '8%' },
      { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: '12%' },
      { title: '备注', dataIndex: 'remarks', key: 'remarks', width: '10%', render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 200,
        render(t, r) {
          return (
            <div>
              <a href="javascript:void(0)" onClick={() => { p.setState({ visible: true, needSplitId: r.id }); }} >订单拆分</a>
            </div>);
        },
      },
    ];
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20}>
            <Col span="8">
              <FormItem
                label="订单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option value="0">未发货</Option>
                    <Option value="3">已发货</Option>
                    <Option value="-1">已关闭</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="备货状态"
                {...formItemLayout}
              >
                {getFieldDecorator('stockStatus', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option value="0">未备货</Option>
                    <Option value="1">部分备货</Option>
                    <Option value="2">部分在途备货</Option>
                    <Option value="3">全部在途备货</Option>
                    <Option value="4">已备货</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="外部订单ID"
                {...formItemLayout}
              >
                {getFieldDecorator('outerOrderId', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span="8">
              <FormItem
                label="外部订单的内部订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('outerNo', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="内部订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('erpNo', {})(
                  <Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="外部订单的订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('targetNo', {})(
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className={styles.listBtnGroup}>
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={() => { resetFields(); }}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col className={styles.orderBtn} style={{ textAlign: 'right' }}>
            <Button type="primary" disabled={isNotSelected} size="large" onClick={p.multiDelivery.bind(p)}>批量发货</Button>
          </Col>
        </Row>
        <Modal
          visible={visible}
          title="拆分"
          onOk={p.splitOrder.bind(p)}
          onCancel={p.handleCancel.bind(p)}
        >
          <Row>
            <Col span={2} offset={3} style={{ marginTop: 5 }}>数量：</Col>
            <Col span={12}>
              <Input style={{ width: '100%' }} ref={(c) => { this.num = c; }} placeholder="请输入需要拆分的数量" />
            </Col>
          </Row>
        </Modal>
        <Table columns={columns} rowSelection={rowSelection} dataSource={erpOrderList} rowKey={r => r.id} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { erpOrderList } = state.order;
  return { erpOrderList };
}

export default connect(mapStateToProps)(Form.create()(ErpOrder));