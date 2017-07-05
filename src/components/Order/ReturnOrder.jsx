import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, DatePicker, Button, Row, Col, Select, Form, Icon } from 'antd';
import ReturnOrderModal from './component/ReturnOrderModal';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@window.regStateCache
class ReturnOrder extends Component {

  constructor() {
    super();
    this.state = {
      visible: false,
    };
  }

  handleSubmit(e, page) {
    const p = this;
    if (e) e.preventDefault();
    // 清除多选
    this.setState({ checkId: [] }, () => {
      this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        if (err) return;
        if (fieldsValue.orderTime && fieldsValue.orderTime[0] && fieldsValue.orderTime[1]) {
          fieldsValue.startGmtCreate = new Date(fieldsValue.orderTime[0]).format('yyyy-MM-dd');
          fieldsValue.endGmtCreate = new Date(fieldsValue.orderTime[1]).format('yyyy-MM-dd');
        }
        delete fieldsValue.orderTime;
        this.props.dispatch({
          type: 'order/queryOrderList',
          payload: {
            ...fieldsValue,
            pageIndex: typeof page === 'number' ? page : 1,
          },
          cb() {
            p.closeModal();
          },
        });
      });
    });
  }

  updateModal(id) {
    const p = this;
    p.setState({
      visible: true,
    }, () => {
      p.props.dispatch({ type: 'order/queryReturnOrderById', payload: { id } });
    });
  }

  closeModal() {
    this.setState({ visible: false }, () => {
      this._refreshData();
    });
  }

  handleEmptyInput(type) { // 清空内容
    const { setFieldsValue } = this.props.form;
    switch (type) {
      case 'orderNo': setFieldsValue({ orderNo: undefined }); break;
      case 'erpNo': setFieldsValue({ erpNo: undefined }); break;
      case 'skuCode': setFieldsValue({ skuCode: undefined }); break;
      case 'itemName': setFieldsValue({ itemName: undefined }); break;
      case 'upc': setFieldsValue({ upc: undefined }); break;
      default: return false;
    }
  }

  showClear(type) { // 是否显示清除按钮
    const { getFieldValue } = this.props.form;
    const data = getFieldValue(type);
    if (data) {
      return <Icon type="close-circle" onClick={this.handleEmptyInput.bind(this, type)} />;
    }
    return null;
  }

  render() {
    const p = this;
    const { form, dispatch, currentPage, returnOrderList = [], returnOrderTotal, returnOrderValues = {} } = p.props;
    const { getFieldDecorator, resetFields } = form;
    const { visible } = p.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columnsList = [
      { title: '主订单号', dataIndex: 'orderNo', key: 'orderNo', width: 120 },
      { title: '子订单号', dataIndex: 'erpNo', key: 'erpNo', width: 120, render(text) { return text || '-'; } },
      { title: '退单原因', dataIndex: 'returnReason', key: 'returnReason', width: 80, render(text) { return text || '-'; } },
      { title: '退单原因详情', dataIndex: 'returnReasonDetail', key: 'returnReasonDetail', width: 150, render(text) { return text ? text.slice(0, 10) : '-'; } },
      { title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render(text) {
          switch (text) {
            case 0: return <font color="">退单中</font>;
            case 1: return <font color="chocolate">已退货</font>;
            case 2: return <font color="blue">已退款</font>;
            default: return '-';
          }
        },
      },
      { title: '退货数量', dataIndex: 'returnQuantity', key: 'returnQuantity', width: 60, render(text) { return text || '-'; } },
      { title: '退款金额', dataIndex: 'returnPrice', key: 'returnPrice', width: 60, render(text) { return text || '-'; } },
      { title: '是否国内退货', dataIndex: 'isGn', key: 'isGn', width: 80, render(text) { return text || '-'; } },
      { title: '是否入库', dataIndex: 'isCheckin', key: 'isCheckin', width: 80, render(text) { return text || '-'; } },
      { title: '收货时间', dataIndex: 'receiveTime', key: 'receiveTime', width: 120, render(text) { return text || '-'; } },
      { title: '退款时间', dataIndex: 'returnPayTime', key: 'returnPayTime', width: 120, render(text) { return text || '-'; } },
      { title: '备注', dataIndex: 'remark', key: 'remark', width: 80, render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 150,
        fixed: 'right',
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" onClick={p.updateModal.bind(p, record.id)}>修改</a>
            </div>);
        },
      },
    ];

    const listPaginationProps = {
      total: returnOrderTotal,
      current: currentPage,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
      },
    };

    return (
      <div>
        <div className="refresh-btn"><Button type="ghost" size="small" onClick={this._refreshData.bind(this)}>刷新</Button></div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="主订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('orderNo', {})(
                  <Input placeholder="请输入主订单号" suffix={p.showClear('orderNo')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="子订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('erpNo', {})(
                  <Input placeholder="请输入子订单号" suffix={p.showClear('erpNo')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="订单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder="请选择订单状态" allowClear>
                    <Option value="0">退款中</Option>
                    <Option value="1">已退货</Option>
                    <Option value="2">已退款</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="UPC"
                {...formItemLayout}
              >
                {getFieldDecorator('upc', {})(
                  <Input placeholder="请输入UPC" suffix={p.showClear('upc')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品代码"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {})(
                  <Input placeholder="请输入商品代码" suffix={p.showClear('skuCode')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('itemName', {})(
                  <Input placeholder="请输入商品名称" suffix={p.showClear('itemName')} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col style={{ marginLeft: 6 }}>
              <FormItem
                label="退款时间"
                labelCol={{ span: 3 }}
              >
                {getFieldDecorator('orderTime', {})(<RangePicker />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginLeft: 13 }}>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={() => { resetFields(); }}>清空</Button>
            </Col>
          </Row>
          <div className="operBtn" style={{ height: 20 }} />
        </Form>
        <Row>
          <Col>
            <Table
              columns={columnsList}
              dataSource={returnOrderList}
              bordered
              size="large"
              rowKey={record => record.id}
              pagination={listPaginationProps}
              scroll={{ x: 1200, y: 500 }}
            />
          </Col>
        </Row>
        <ReturnOrderModal
          visible={visible}
          close={this.closeModal.bind(this)}
          data={returnOrderValues}
          returnType="修改"
          dispatch={dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { returnOrderList, returnOrderTotal, returnCurrentPage, returnOrderValues } = state.order;
  return {
    returnOrderList,
    returnOrderTotal,
    returnCurrentPage,
    returnOrderValues,
  };
}

export default connect(mapStateToProps)(Form.create()(ReturnOrder));
