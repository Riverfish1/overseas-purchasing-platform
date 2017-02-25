import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Pagination, Input, Popover, Button, message, Row, Col, Select, DatePicker, Form, Icon, TreeSelect } from 'antd';
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
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      orderStatus: '0',
      stockingStatus: '0',
      stockingAddr: '0',
    });
  }

  updateModal(id) {
    let p = this;
    console.log(id);
    if (id.length === 1) {
      this.setState({
        modalVisible: true,
      }, () => {
        p.props.dispatch({ type: 'products/queryProduct', payload: { id: id[0] } });
      });
    } else {
      message.error('至少选择一个，且只能选择一个进行修改');
    }
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
  }

  render() {
    let p = this;
    const { form, orderList = {}, } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      {
        title: '序号', dataIndex: 'order', key: 'order',
        render(text, record, index) {
          return index + 1;
        },
      },
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
        title: '操作', dataIndex: 'operator', key: 'operator',
        render(text, record, index) {
          return <a href="javascript:void(0)" onClick={p.updateModal.bind(this, record.id)}>修改</a>
        }
      },
    ];
    const rowSelection = {
      getCheckboxProps: record => ({}),
      onChange(selectedRowKeys) {
        p.setState({ updateId: selectedRowKeys });
      },
    };

    const paginationProps = {
      total: orderList && orderList.total,
      pageSize: 10,
      onChange(page) {
        p.props.dispatch({
          type: 'products/queryItemList',
          payload: { page },
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
                label="订单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('orderStatus', {
                  initialValue: "0",
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
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="备货状态"
                {...formItemLayout}
              >
                {getFieldDecorator('stockingStatus', {
                  initialValue: "0",
                  rules: [{ message: '请输入备货状态' }],
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
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="备货地点"
                {...formItemLayout}
              >
                {getFieldDecorator('stockingAddr', {
                  initialValue: "0",
                  rules: [{ message: '请输入备货地点' }],
                })(
                  <Select>
                    <Option value="0">不限</Option>
                    <Option value="1">国内</Option>
                    <Option value="2">西雅图</Option>
                    <Option value="3">波特兰</Option>
                  </Select>
                )}
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
          <Col span={3}>
            <Popover content={orderStatusContent} title={null} trigger="hover">
              <Button size="large">状态操作</Button>
            </Popover>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={orderList && orderList.rows}
              bordered
              size="large"
              rowKey={record => record.id}
              rowSelection={rowSelection}
              pagination={paginationProps}
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

Order = Form.create()(Order);

export default connect(mapStateToProps)(Order);
