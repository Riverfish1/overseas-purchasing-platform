import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Table, Popover, Input, DatePicker, Button, Row, Col, Select, Form } from 'antd';
import OrderModal from './OrderModal';
import styles from './Order.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

class Order extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      updateId: [], // 修改商品传的id
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, filedsValue) => {
      if (err) {
        return;
      }
      console.log(filedsValue);
      this.props.dispatch({
        type: 'order/queryOrderList',
        payload: { ...filedsValue },
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
    p.setState({
      modalVisible: true,
    }, () => {
      p.props.dispatch({ type: 'order/queryOrder', payload: { id } });
    });
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
  }

  render() {
    const p = this;
    const { form, orderList = { rows: [{ orderCode: '1', outOrder: '2', custom: '3', id: 4 }] } } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columnsList = [
      {
        title: '订单编号', dataIndex: 'orderCode', key: 'orderCode',
      },
      {
        title: '外部订单号', dataIndex: 'outOrder', key: 'outOrder',
      },
      {
        title: '客户', dataIndex: 'custom', key: 'custom',
      },
      {
        title: '订单时间', dataIndex: 'orderTime', key: 'orderTime',
      },
      {
        title: '订单状态', dataIndex: 'orderStatus', key: 'orderStatus',
      },
      {
        title: '备货状态', dataIndex: 'stockingStatus', key: 'stockingStatus',
      },
      {
        title: '收件人', dataIndex: 'recipient', key: 'recipient',
      },
      {
        title: '收件人地址', dataIndex: 'recipientAddr', key: 'recipientAddr',
      },
      {
        title: '联系电话', dataIndex: 'contactTel', key: 'contactTel',
      },
      {
        title: '身份证', dataIndex: 'idCard', key: 'idCard',
      },
      {
        title: '创建时间', dataIndex: 'timeGmt', key: 'timeGmt',
      },
      {
        title: '付款时间', dataIndex: 'payTime', key: 'payTime',
      },
      {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={p.updateModal.bind(p, record.id)}>修改</a>
              <Popover title={null} content={orderStatusContent}>
                <a href="javascript:void(0)" >状态操作</a>
              </Popover>
            </div>);
        },
      },
    ];

    const rowSelection = {
      type: 'radio',
      onChange(selectedRowKeys, selectedRows) {
        console.log(selectedRowKeys, selectedRows);
        const values = getFieldsValue();
        console.log(values);
      },
    };

    const listPaginationProps = {
      total: orderList && orderList.total,
      pageSize: 10,
      onChange(page) {
        p.props.dispatch({
          type: 'order/queryOrderList',
          payload: { pageIndex: page },
        });
      },
    };

    const skuColumns = [
      {
        title: '商品SKU',
        dataIndex: 'productSKU',
        key: '1',
      },
      {
        title: '分配标记',
        dataIndex: 'productSKU',
        key: '2',
      },
      {
        title: '商品主图',
        dataIndex: 'productSKU',
        key: '3',
      },
      {
        title: '商品名称',
        dataIndex: 'productSKU',
        key: '4',
      },
      {
        title: '颜色',
        dataIndex: 'productSKU',
        key: '5',
      },
      {
        title: '尺码',
        dataIndex: 'productSKU',
        key: '6',
      },
      {
        title: '品牌',
        dataIndex: 'productSKU',
        key: '7',
      },
      {
        title: '条码',
        dataIndex: 'productSKU',
        key: '8',
      },
      {
        title: '销售价',
        dataIndex: 'productSKU',
        key: '9',
      },
      {
        title: '运费',
        dataIndex: 'productSKU',
        key: '10',
      },
      {
        title: '数量',
        dataIndex: 'productSKU',
        key: '11',
      },
      {
        title: '采购数量',
        dataIndex: 'productSKU',
        key: '12',
      },
      {
        title: '入库数量',
        dataIndex: 'productSKU',
        key: '13',
      },
      {
        title: '在途数量',
        dataIndex: 'productSKU',
        key: '14',
      },
      {
        title: '总金额',
        dataIndex: 'productSKU',
        key: '15',
      },
      {
        title: '线路',
        dataIndex: 'productSKU',
        key: '16',
      },
      {
        title: '重量',
        dataIndex: 'productSKU',
        key: '17',
      },
      {
        title: '重量单位',
        dataIndex: 'productSKU',
        key: '18',
      },
      {
        title: '商品来源路径',
        dataIndex: 'productSKU',
        key: '19',
      },
    ];

    const skuPaginationProps = {
      total: orderList.data && orderList.data.total,
      pageSize: 10,
      onChange(page) {
        p.props.dispatch({
          type: 'order/queryOrderSku',
          payload: { pageIndex: page },
        });
      },
    };

    const orderStatusContent = (
      <div className={styles.popoverContent}>
        <p><a href="javascript:void(0)">取消订单</a></p>
        <p><a href="javascript:void(0)">支付确认</a></p>
        <p><a href="javascript:void(0)">完成确认</a></p>
        <p><a href="javascript:void(0)">重新分配库存</a></p>
        <p><a href="javascript:void(0)">所有订单重新分配库存</a></p>
        <p><a href="javascript:void(0)">清楚分配数据</a></p>
        <p><a href="javascript:void(0)">拆分订单</a></p>
      </div>
    );

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={40}>
            <Col span={6}>
              <FormItem
                label="客户"
                {...formItemLayout}
              >
                {getFieldDecorator('salesName', {})(
                  <Input placeholder="请输入客户名称" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="外部订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('targetNo', {})(
                  <Input placeholder="请输入外部订单号" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('orderNo', {})(
                  <Input placeholder="请输入订单号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={6}>
              <FormItem
                label="订单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {
                  initialValue: '0',
                  rules: [{ message: '请输入订单状态' }],
                })(
                  <Select>
                    <Option value="0">不限</Option>
                    <Option value="1">待支付</Option>
                    <Option value="2">待审核</Option>
                    <Option value="3">备货中</Option>
                    <Option value="4">部分发货</Option>
                    <Option value="5">已发货</Option>
                    <Option value="6">已完成</Option>
                    <Option value="7">已取消</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="订单备货状态"
                {...formItemLayout}
              >
                {getFieldDecorator('stockStatus', {
                  initialValue: '0',
                  rules: [{ message: '请输入订单备货状态' }],
                })(
                  <Select>
                    <Option value="0">不限</Option>
                    <Option value="1">未备货</Option>
                    <Option value="2">备货中</Option>
                    <Option value="3">部分备货</Option>
                    <Option value="4">部分备货，在途</Option>
                    <Option value="5">部分备货，在途，可发</Option>
                    <Option value="6">部分备货，可发</Option>
                    <Option value="7">备货完成</Option>
                    <Option value="8">备货完成，在途，可发</Option>
                    <Option value="9">备货完成，可发</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={6}>
              <FormItem
                label="订单时间开始"
                {...formItemLayout}
              >
                {getFieldDecorator('startOrderTime', {})(
                  <DatePicker format="YYYY-MM-DD" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="订单时间结束"
                {...formItemLayout}
              >
                {getFieldDecorator('endOrderTime', {})(
                  <DatePicker format="YYYY-MM-DD" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={5} push={3}>
              <Button htmlType="submit" size="large" type="primary">查询</Button>
            </Col>
            <Col span={4}>
              <Button size="large" type="ghost" onClick={this.handleEmpty.bind(this)}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row className={styles.plus}>
          <Col span={3}>
            <Button type="primary" size="large" onClick={this.addModal.bind(this)}>新增订单</Button>
          </Col>
        </Row>
        <Row style={{ minHeight: 300 }}>
          <Col>
            <Table
              columns={columnsList}
              dataSource={orderList && orderList.rows}
              bordered
              size="large"
              rowKey={record => record.id}
              rowSelection={rowSelection}
              pagination={listPaginationProps}
            />
          </Col>
        </Row>
        <Row style={{ height: 30, borderTop: '1px solid #ccc' }} />
        <Row style={{ minHeight: 300 }}>
          <Col>
            <Table
              columns={skuColumns}
              dataSource={orderList && orderList.rows}
              bordered
              size="large"
              rowKey={record => record.id}
              pagination={skuPaginationProps}
              scroll={{ x: 1200 }}
            />
          </Col>
        </Row>
        <OrderModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={orderList}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { orderList } = state.order;
  return {
    orderList,
  };
}

Order.PropTypes = {
  orderList: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
};

const OrderList = Form.create()(Order);

export default connect(mapStateToProps)(OrderList);
