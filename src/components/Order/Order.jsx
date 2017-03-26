
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Popover, Input, DatePicker, Button, Row, Col, Select, Form, Modal, Popconfirm } from 'antd';
import OrderModal from './OrderModal';
import styles from './Order.less';

const FormItem = Form.Item;
const Option = Select.Option;

class Order extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      visible: false,
      title: '', // modal的title
      updateId: [], // 修改商品传的id
    };
  }

  componentWillMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'order/querySalesName',
    //   payload: {},
    // });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (fieldsValue.startOrderTime) fieldsValue.startOrderTime = new Date(fieldsValue.startOrderTime).format('yyyy-MM-dd');
      if (fieldsValue.endOrderTime) fieldsValue.endOrderTime = new Date(fieldsValue.endOrderTime).format('yyyy-MM-dd');
      this.props.dispatch({
        type: 'order/queryOrderList',
        payload: { ...fieldsValue, pageIndex: 1 },
      });
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
      title: '新增',
    });
    this.props.dispatch({
      type: 'sku/querySkuList',
      payload: {},
    });
  }

  updateModal(id) {
    window.event.stopPropagation();
    const p = this;
    p.setState({
      modalVisible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({ type: 'order/queryOrder', payload: { id } });
    });
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
    this.props.dispatch({
      type: 'order/saveOrder',
      payload: {},
    });
  }

  handleProDetail(record) {
    const p = this;
    p.setState({
      visible: true,
    }, () => {
      p.props.dispatch({
        type: 'order/queryOrder',
        payload: { id: record.id, type: 'snip' },
      });
    });
  }

  handleDelete(id) {
    this.props.dispatch({
      type: 'order/deleteOrder',
      payload: { id },
    });
  }

  render() {
    const p = this;
    const { form, orderList = [], orderTotal, currentPage, orderValues = {}, orderSkuSnip = {}, salesName = [] } = p.props;
    const { getFieldDecorator, getFieldsValue, resetFields } = form;
    const { title, visible } = p.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columnsList = [
      {
        title: '订单编号', dataIndex: 'orderNo', key: 'orderNo',
      },
      {
        title: '外部订单号', dataIndex: 'targetNo', key: 'targetNo', render(text) { return text || '-'; },
      },
      {
        title: '客户', dataIndex: 'salesName', key: 'salesName', render(text) { return text || '-'; },
      },
      {
        title: '订单时间', dataIndex: 'orderTime', key: 'orderTime', render(text) { return text || '-'; },
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        render(text) {
          if (text === 0) {
            return <span>待支付</span>;
          } else if (text === 1) {
            return <span>待审核</span>;
          } else if (text === 2) {
            return <span>备货中</span>;
          } else if (text === 3) {
            return <span>部分发货</span>;
          } else if (text === 4) {
            return <span>已发货</span>;
          } else if (text === 5) {
            return <span>已完成</span>;
          } else if (text === 6) {
            return <span>已取消</span>;
          }
          return '-';
        },
      },
      {
        title: '备货状态',
        dataIndex: 'stockStatus',
        key: 'stockStatus',
        render(text) {
          if (text === 1) {
            return <span>未备货</span>;
          } else if (text === 2) {
            return <span>备货中</span>;
          } else if (text === 3) {
            return <span>部分备货</span>;
          } else if (text === 4) {
            return <span>部分备货，在途</span>;
          } else if (text === 5) {
            return <span>部分备货，在途，可发</span>;
          } else if (text === 6) {
            return <span>部分备货，可发</span>;
          } else if (text === 7) {
            return <span>备货完成</span>;
          } else if (text === 8) {
            return <span>备货完成、在途</span>;
          } else if (text === 9) {
            return <span>备货完成、在途、可发</span>;
          }
          return '-';
        },
      },
      {
        title: '收件人', dataIndex: 'receiver', key: 'receiver',
      },
      {
        title: '收件人地址',
        dataIndex: 'address',
        key: 'address',
        render(text, record) {
          return <span>{text ? `${text} ${record.addressDetail}` : '-'}</span>;
        },
      },
      {
        title: '联系电话', dataIndex: 'telephone', key: 'telephone',
      },
      {
        title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate',
      },
      {
        title: '备注', dataIndex: 'remarks', key: 'remarks', render(text) { return text || '-'; },
      },
      {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 200,
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" onClick={p.handleProDetail.bind(p, record)}>查看SKU</a>
              <a href="javascript:void(0)" style={{ margin: '0 10px' }} onClick={p.updateModal.bind(p, record.id)}>修改</a>
              <Popconfirm title="确定删除此订单？" onConfirm={p.handleDelete.bind(p, record.id)}>
                <a href="javascript:void(0)" style={{ marginRight: '10px' }}>删除</a>
              </Popconfirm>
              <Popover title={null} content={orderStatusContent}>
                <a href="javascript:void(0)" >状态操作</a>
              </Popover>
            </div>);
        },
      },
    ];

    const listPaginationProps = {
      total: orderTotal,
      current: currentPage,
      pageSize: 10,
      onChange(page) {
        const values = getFieldsValue();
        const payload = {};
        Object.keys(values).forEach((key) => {
          if (values[key]) {
            payload[key] = values[key];
          }
        });
        p.props.dispatch({
          type: 'order/queryOrderList',
          payload: { ...payload, pageIndex: page },
        });
      },
    };

    const skuColumns = [
      {
        title: '商品SKU',
        dataIndex: 'skuCode',
        key: 'skuCode',
        render(text) { return text || '-'; },
      },
      {
        title: '颜色',
        dataIndex: 'color',
        key: 'color',
        render(text) { return text || '-'; },
      },
      {
        title: '尺码',
        dataIndex: 'scale',
        key: 'scale',
        render(text) { return text || '-'; },
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        render(text) { return text || '-'; },
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        render(text) { return text || '-'; },
      },
      {
        title: '运费',
        dataIndex: 'freight',
        key: '10',
        render(text) { return text || '-'; },
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        key: '11',
        render(text) { return text || '-'; },
      },
      {
        title: '商品名称',
        dataIndex: 'itemName',
        key: 'itemName',
        render(text) { return text || '-'; },
      },
    ];

    const orderStatusContent = (
      <div className={styles.popoverContent}>
        <p><a href="javascript:void(0)">取消订单</a></p>
        <p><a href="javascript:void(0)">支付确认</a></p>
        <p><a href="javascript:void(0)">完成确认</a></p>
        <p><a href="javascript:void(0)">重新分配库存</a></p>
        <p><a href="javascript:void(0)">所有订单重新分配库存</a></p>
        <p><a href="javascript:void(0)">清除分配数据</a></p>
        <p><a href="javascript:void(0)">拆分订单</a></p>
      </div>
    );

    const modalProps = {
      title: `订单编号：${(orderSkuSnip.data && orderSkuSnip.data.orderNo) || '-'}`,
      footer: null,
      visible,
      width: 1200,
      closable: true,
      onCancel() {
        p.setState({ visible: false });
        p.props.dispatch({ type: 'order/saveOrderSkuSnip', payload: {} });
      },
    };

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20}>
            <Col span="8">
              <FormItem
                label="客户"
                {...formItemLayout}
              >
                {getFieldDecorator('salesName', {})(
                  <Input placeholder="请输入客户名称" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="外部订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('targetNo', {})(
                  <Input placeholder="请输入外部订单号" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('orderNo', {})(
                  <Input placeholder="请输入订单号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span="8">
              <FormItem
                label="收件人"
                {...formItemLayout}
              >
                {getFieldDecorator('receiver', {})(
                  <Input placeholder="请输入收件人" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="联系电话"
                {...formItemLayout}
              >
                {getFieldDecorator('telephone', {})(
                  <Input placeholder="请输入联系电话" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="订单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder="请选择订单状态">
                    <Option value="0">待支付</Option>
                    <Option value="1">待审核</Option>
                    <Option value="2">备货中</Option>
                    <Option value="3">部分发货</Option>
                    <Option value="4">已发货</Option>
                    <Option value="5">已完成</Option>
                    <Option value="6">已取消</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span="8">
              <FormItem
                label="订单备货状态"
                {...formItemLayout}
              >
                {getFieldDecorator('stockStatus', {})(
                  <Select placeholder="请选择订单备货状态">
                    <Option value="1">未备货</Option>
                    <Option value="2">备货中</Option>
                    <Option value="3">部分备货</Option>
                    <Option value="4">部分备货，在途</Option>
                    <Option value="5">部分备货，在途，可发</Option>
                    <Option value="6">部分备货，可发</Option>
                    <Option value="7">备货完成</Option>
                    <Option value="8">备货完成、在途</Option>
                    <Option value="9">备货完成、在途、可发</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="订单时间开始"
                {...formItemLayout}
              >
                {getFieldDecorator('startOrderTime', {})(
                  <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} size="large" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="订单时间结束"
                {...formItemLayout}
              >
                {getFieldDecorator('endOrderTime', {})(
                  <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} size="large" />)}
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
          <Col className={styles.orderBtn}>
            <Button type="primary" size="large" onClick={p.showModal.bind(p)}>新增订单</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columnsList}
              dataSource={orderList}
              bordered
              size="large"
              rowKey={record => record.id}
              pagination={listPaginationProps}
            />
          </Col>
        </Row>
        <Modal {...modalProps}>
          <Table
            columns={skuColumns}
            dataSource={orderSkuSnip.data && orderSkuSnip.data.orderDetails}
            bordered
            size="large"
            rowKey={record => record.id}
            pagination={false}
          />
        </Modal>
        <OrderModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={orderValues}
          salesName={salesName}
          title={title}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { orderList, orderTotal, currentPage, orderValues, orderSkuSnip, salesName } = state.order;
  return {
    orderList,
    orderTotal,
    currentPage,
    orderValues,
    orderSkuSnip,
    salesName,
  };
}

const OrderList = Form.create()(Order);

export default connect(mapStateToProps)(OrderList);
