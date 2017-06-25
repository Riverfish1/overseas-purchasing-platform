import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Row, Col, Input, Select, Button, Modal, Popover, Popconfirm, DatePicker, Icon, message } from 'antd';

import DeliveryModal from './component/DeliveryModal';
import BatchDeliveryModal from './component/BatchDeliveryModal';
import ErpOrderModal from './ErpOrderModal';
import SplitOrder from './component/SplitOrder';
import RecordList from './component/RecordList';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@window.regStateCache
class ErpOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      title: '',
      checkId: [], // 发货时传的ID
      needSplitId: '',
      deliveryModalVisible: false,
      type: 'add', // 发货的判断
      batchDeliveryVisible: false,
    };
  }
  handleSubmit(e, page, pageSize) {
    if (e) e.preventDefault();
    console.log(this);
    const { erpCurrentPageSize } = this.props;
    // 清除多选
    this.setState({ checkId: [] }, () => {
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) return;
        if (fieldsValue.orderTime && fieldsValue.orderTime[0] && fieldsValue.orderTime[1]) {
          fieldsValue.startGmtCreate = new Date(fieldsValue.orderTime[0]).format('yyyy-MM-dd');
          fieldsValue.endGmtCreate = new Date(fieldsValue.orderTime[1]).format('yyyy-MM-dd');
        }
        delete fieldsValue.orderTime;
        this.props.dispatch({
          type: 'order/queryErpOrderList',
          payload: {
            ...fieldsValue,
            pageIndex: typeof page === 'number' ? page : 1,
            pageSize: pageSize || erpCurrentPageSize,
          },
        });
      });
    });
  }
  showDeliveryModal() { // 发货
    const p = this;
    // 请求信息
    this.props.dispatch({
      type: 'order/queryErpOrderDetail',
      payload: {
        erpOrderId: this.state.checkId,
        callback() {
          p.setState({ deliveryModalVisible: true });
        },
      },
    });
  }
  showBatchDeliveryModal() { // 批量发货
    const { checkId } = this.state;
    const p = this;
    this.props.dispatch({
      type: 'order/batchDeliveryForm',
      payload: { erpOrderId: JSON.stringify(checkId) },
      callback(data) {
        if (data === 'success') {
          p.setState({ batchDeliveryVisible: true });
        } else {
          Modal.error({
            title: '提示',
            content: data,
          });
        }
      },
    });
  }
  replayAssign() {
    const p = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/replayAssign',
      payload: {
        orderIds: JSON.stringify(p.state.checkId),
        callback() {
          p.setState({ checkId: [] }); // 取消选择 checkId
          dispatch({
            type: 'order/queryErpOrderList',
            payload: {},
          });
        },
      },
    });
  }
  closeErpOrder() { // 子订单关闭
    const p = this;
    const { dispatch } = this.props;
    Modal.confirm({
      title: '关闭',
      content: '确定要关闭吗？',
      onOk: () => {
        dispatch({
          type: 'order/closeErpOrder',
          payload: {
            orderIds: JSON.stringify(p.state.checkId),
            callback() {
              p.setState({ checkId: [] }); // 取消选择 checkId
              dispatch({
                type: 'order/queryErpOrderList',
                payload: {},
              });
            },
          },
        });
      },
    });
  }
  showModal(id, e) {
    e.stopPropagation();
    const p = this;
    p.setState({
      modalVisible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({ type: 'order/queryErpOrder', payload: { id } });
    });
  }
  closeDeliveryModal() {
    this.props.dispatch({
      type: 'order/saveErpOrderDetail',
      payload: {},
    });
    this.setState({ deliveryModalVisible: false, checkId: [] }); // 取消选择 checkId
  }
  closeBatchDeliveryModal() {
    this.setState({ batchDeliveryVisible: false, checkId: [] });
  }
  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
    this.props.dispatch({
      type: 'order/saveErpOrder',
      payload: {},
    });
  }
  handleInventory(type, id) {
    if (type === 'lock') {
      this.props.dispatch({ type: 'order/lockErpOrder', payload: { id } });
    }
    if (type === 'release') {
      this.props.dispatch({ type: 'order/releaseInventory', payload: { id } });
    }
  }
  handleEmptyInput(type) { // 清空内容
    const { setFieldsValue } = this.props.form;
    switch (type) {
      case 'orderNo': setFieldsValue({ orderNo: undefined }); break;
      case 'erpNo': setFieldsValue({ erpNo: undefined }); break;
      case 'targetNo': setFieldsValue({ targetNo: undefined }); break;
      case 'skuCode': setFieldsValue({ skuCode: undefined }); break;
      case 'itemName': setFieldsValue({ itemName: undefined }); break;
      case 'upc': setFieldsValue({ upc: undefined }); break;
      case 'receiver': setFieldsValue({ receiver: undefined }); break;
      case 'telephone': setFieldsValue({ telephone: undefined }); break;
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
  exportErpOrder() { // 导出订单
    const { form } = this.props;
    const p = this;
    form.validateFields((err, values) => {
      if (err) return;
      let startOrderTime;
      let endOrderTime;
      if (values.orderTime && values.orderTime[0] && values.orderTime[1]) {
        startOrderTime = new Date(values.orderTime[0]).format('yyyy-MM-dd');
        endOrderTime = new Date(values.orderTime[1]).format('yyyy-MM-dd');
        p.props.dispatch({
          type: 'order/exportErpOrder',
          payload: {
            startOrderTime,
            endOrderTime,
          },
        });
      } else {
        message.error('请选择创建时间范围');
      }
    });
  }
  render() {
    const p = this;
    const { erpOrderList, erpOrderTotal, erpCurrentPageSize, erpOrderDetail, form, dispatch, agencyList = [], erpOrderValues = {}, deliveryCompanyList = [], wareList = [] } = p.props;
    const { getFieldDecorator, resetFields } = form;
    const { deliveryModalVisible, checkId, type, modalVisible, title, batchDeliveryVisible } = p.state;

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        const listId = [];
        selectedRows.forEach((el) => {
          listId.push(el.id);
        });
        p.setState({ checkId: listId });
      },
      selectedRowKeys: p.state.checkId,
    };
    const columns = [
      { title: '主订单号', dataIndex: 'orderNo', key: 'orderNo', width: 110 },
      { title: '子订单号', dataIndex: 'erpNo', key: 'erpNo', width: 150 },
      { title: '销售时间', dataIndex: 'orderTime', key: 'orderTime', width: 150, render(text) { return text ? text.slice(0, 10) : '-'; } },
      { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 150, render(text) { return text || '-'; } },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 150 },
      { title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        width: 50,
        render(text) {
          switch (text) {
            case 0: return '新建';
            case 1: return '确认';
            case 2: return '已发货';
            case -1: return '已关闭';
            default: return '-';
          }
        },
      },
      {
        title: '备货状态',
        dataIndex: 'stockStatus',
        key: 'stockStatus',
        width: 80,
        render(text) {
          switch (text) {
            case 0: return '未备货';
            case 1: return '部分备货';
            case 2: return '部分在途备货';
            case 3: return '全部在途备货';
            case 4: return '混合备货完成';
            case 9: return '已释放';
            case 10: return '已备货';
            default: return '-';
          }
        },
      },
      { title: '颜色',
        dataIndex: 'color',
        key: 'color',
        width: 80,
        render(text) { return text || '-'; },
      },
      { title: '尺码',
        dataIndex: 'scale',
        key: 'scale',
        width: 80,
        render(text) { return text || '-'; },
      },
      { title: '图片',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: 80,
        render(text) {
          if (!text) return '-';
          const picList = JSON.parse(text).picList;
          const t = picList.length ? JSON.parse(text).picList[0].url : '';
          return (
            t ? <Popover title={null} content={<img role="presentation" src={t} style={{ width: 400 }} />}>
              <img role="presentation" src={t} width={60} height={60} />
            </Popover> : '-'
          );
        },
      },
      { title: 'UPC', dataIndex: 'upc', key: 'upc', width: 100 },
      { title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 100 },
      { title: '外部订单号', dataIndex: 'targetNo', key: 'targetNo', width: 150, render(text) { return text || '-'; } },
      { title: '发货方式', dataIndex: 'logisticType', key: 'logisticType', width: 60, render(text) { return text === 0 ? '直邮' : (text === 1 ? '拼邮' : '-'); } },
      { title: '仓库名', dataIndex: 'warehouseName', key: 'warehouseName', width: 100, render(text) { return text || '-'; } },
      { title: '商品数量', dataIndex: 'quantity', key: 'quantity', width: 60, render(text) { return text || '-'; } },
      { title: '收件人', dataIndex: 'receiver', key: 'receiver', width: 50 },
      { title: '收件人地址',
        dataIndex: 'address',
        key: 'address',
        width: 200,
        render(text, r) {
          return <span>{r.receiverState ? `${r.receiverState} ${r.receiverCity} ${r.receiverDistrict} ${r.addressDetail}` : '-'}</span>;
        },
      },
      { title: '联系电话', dataIndex: 'telephone', key: 'telephone', width: 150 },
      // { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 220 },
      // { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 200 },
      { title: '备注', dataIndex: 'remark', key: 'remark', width: 100, render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 110,
        fixed: 'right',
        render(t, r) {
          return (
            <div>
              {r.status === 0 && r.quantity > 1 && <SplitOrder dispatch={dispatch} record={r} />}
              {r.stockStatus !== 0 && r.stockStatus !== 9 && <RecordList dispatch={dispatch} record={r} />}
              {r.status === 0 && <a href="javascript:void(0)" onClick={p.showModal.bind(p, r.id)} >修改</a>}
              {r.status === 0 && [0, 1, 2, 9].indexOf(r.stockStatus) > -1 &&
              <Popconfirm title="确定分配库存吗？" onConfirm={p.handleInventory.bind(p, 'lock', r.id)}>
                <a href="javascript:void(0)" style={{ marginLeft: '10px' }} >分配库存</a>
              </Popconfirm>}
              {r.status === 0 && [0, 9].indexOf(r.stockStatus) === -1 &&
              <Popconfirm title="确定释放库存吗？" onConfirm={p.handleInventory.bind(p, 'release', r.id)}>
                <a href="javascript:void(0)" style={{ marginLeft: '10px' }} >释放库存</a>
              </Popconfirm>}
              {r.status !== 0 && <span style={{ color: '#ccc' }}>暂无</span>}
            </div>);
        },
      },
    ];
    const pagination = {
      total: erpOrderTotal,
      pageSize: erpCurrentPageSize,
      showSizeChanger: true,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
      },
      pageSizeOptions: ['20', '50', '100', '200', '500'],
      onShowSizeChange(current, size) {
        p.handleSubmit(null, 1, size);
      },
    };
    const isNotSelected = this.state.checkId.length === 0;
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
                  <Input placeholder="请输入" suffix={p.showClear('orderNo')} />,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="子订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('erpNo', {})(
                  <Input placeholder="请输入" suffix={p.showClear('erpNo')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="外部订单号"
                {...formItemLayout}
              >
                {getFieldDecorator('targetNo', {})(
                  <Input placeholder="请输入" suffix={p.showClear('targetNo')} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="订单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option value="0">新建</Option>
                    <Option value="2">已发货</Option>
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
                    <Option value="4">混合备货完成</Option>
                    <Option value="9">已释放</Option>
                    <Option value="10">已备货</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="SKU代码"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {})(
                  <Input placeholder="请输入" suffix={p.showClear('skuCode')} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('itemName', {})(
                  <Input placeholder="请输入" suffix={p.showClear('itemName')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="UPC"
                {...formItemLayout}
              >
                {getFieldDecorator('upc', {})(
                  <Input placeholder="请输入" suffix={p.showClear('upc')} />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="收件人"
                {...formItemLayout}
              >
                {getFieldDecorator('receiver', {})(
                  <Input placeholder="请输入" suffix={p.showClear('receiver')} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="销售人员"
                {...formItemLayout}
              >
                {getFieldDecorator('salesName', {})(
                  <Select placeholder="请选择销售" allowClear>
                    {agencyList.map((el) => {
                      return <Option key={el.id} value={el.name}>{el.name}</Option>;
                    })}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="发货方式"
                {...formItemLayout}
              >
                {getFieldDecorator('logisticType', {})(
                  <Select placeholder="请选择" allowClear>
                    <Option value="0">直邮</Option>
                    <Option value="1">拼邮</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="手机号码"
                {...formItemLayout}
              >
                {getFieldDecorator('telephone', {})(
                  <Input placeholder="请输入" suffix={p.showClear('telephone')} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="仓库"
                {...formItemLayout}
              >
                {getFieldDecorator('warehouseId', {})(
                  <Select placeholder="请选择仓库" optionLabelProp="title" allowClear>
                    {wareList.map(el => <Option key={el.id} title={el.name}>{el.name}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem
                label="创建时间范围"
                labelCol={{ span: 6 }}
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
        </Form>
        <Row className="operBtn">
          <Button style={{ float: 'left', marginRight: 10 }} type="primary" disabled={isNotSelected} size="large" onClick={p.showDeliveryModal.bind(p)}>发货</Button>
          <Button style={{ float: 'left' }} type="primary" disabled={isNotSelected} size="large" onClick={p.showBatchDeliveryModal.bind(p)}>批量发货</Button>
          <Button style={{ float: 'right', marginLeft: 10 }} type="primary" disabled={isNotSelected} size="large" onClick={p.replayAssign.bind(p)}>重分配库存</Button>
          <Button style={{ float: 'right', marginLeft: 10 }} disabled={isNotSelected} size="large" onClick={p.closeErpOrder.bind(p)}>关闭</Button>
          <Button style={{ float: 'right' }} type="primary" disabled={isNotSelected} size="large" onClick={p.exportErpOrder.bind(p)}>导出订单</Button>
        </Row>
        <DeliveryModal
          visible={deliveryModalVisible}
          deliveryCompanyList={deliveryCompanyList}
          checkId={checkId}
          data={erpOrderDetail}
          closeModal={this.closeDeliveryModal.bind(this)}
          dispatch={dispatch}
          type={type}
        />
        <BatchDeliveryModal
          visible={batchDeliveryVisible}
          deliveryCompanyList={deliveryCompanyList}
          checkId={checkId}
          closeModal={this.closeBatchDeliveryModal.bind(this)}
          dispatch={dispatch}
          submit={this.handleSubmit.bind(this)}
        />
        <Table
          columns={columns}
          rowSelection={rowSelection}
          dataSource={erpOrderList}
          rowKey={r => r.id}
          pagination={pagination}
          scroll={{ x: '200%', y: 540 }}
          bordered={true}
        />
        <ErpOrderModal
          visible={modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={erpOrderValues}
          agencyList={agencyList}
          title={title}
          dispatch={dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { erpOrderList, erpOrderTotal, erpCurrentPageSize, erpOrderDetail, erpOrderValues, deliveryCompanyList } = state.order;
  const { list } = state.agency;
  const { wareList } = state.inventory;
  return { erpOrderList, erpOrderTotal, erpCurrentPageSize, erpOrderDetail, agencyList: list, erpOrderValues, deliveryCompanyList, wareList };
}

export default connect(mapStateToProps)(Form.create()(ErpOrder));
