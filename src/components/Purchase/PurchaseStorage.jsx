import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Select, DatePicker, Form, Popconfirm, Modal, Popover } from 'antd';
import PurchaseStorageModal from './PurchaseStorageModal';

const FormItem = Form.Item;
const Option = Select.Option;

@window.regStateCache
class PurchaseStorage extends Component {

  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
      showDetail: false,
    };
  }

  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  batchStorage() {
    const p = this;
    Modal.confirm({
      title: '确认将选中项批量入库？',
      content: '操作不可撤回，请预先核对',
      onOk() {
        p.props.dispatch({ type: 'purchaseStorage/multiConfirmStorage', payload: { ids: JSON.stringify(p.state.selectedRowKeys) } });
        p.setState({ selectedRowKeys: [] });
      },
    });
  }

  handleSubmit(e, page) {
    if (e) e.preventDefault();
    // 清除多选
    this.setState({ selectedRowKeys: [] }, () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }
        if (values.orderDate && values.orderDate[0] && values.orderDate[1]) {
          values.startTime = new Date(values.orderDate[0]).format('yyyy-MM-dd');
          values.endTime = new Date(values.orderDate[1]).format('yyyy-MM-dd');
        }
        if (values.storageDate && values.storageDate[0] && values.storageDate[1]) {
          values.putInStart = new Date(values.storageDate[0]).format('yyyy-MM-dd');
          values.putInEnd = new Date(values.storageDate[1]).format('yyyy-MM-dd');
        }
        delete values.orderDate;
        delete values.storageDate;
        this.props.dispatch({
          type: 'purchaseStorage/queryPurchaseStorageList',
          payload: { ...values, pageIndex: typeof page === 'number' ? page : 1 },
        });
      });
    });
  }

  showModal(type, id) {
    if (type === 'update') {
      this.props.dispatch({ type: 'purchaseStorage/queryStorage', payload: { id } });
    }
    this.props.dispatch({ type: 'purchaseStorage/toggleShowModal' });
  }

  handleEmpty() {
    const { resetFields } = this.props.form;
    resetFields();
  }

  handleDelete(id) {
    this.props.dispatch({ type: 'purchaseStorage/deleteStorage', payload: { id } });
  }

  updateModal(id) {
    const p = this;
    this.setState({
      modalVisible: true,
    }, () => {
      p.props.dispatch({ type: 'products/queryProduct', payload: { id } });
    });
  }

  queryDetail(r) {
    const p = this;
    p.setState({ showDetail: true }, () => {
      p.props.dispatch({
        type: 'purchaseStorage/queryStorage',
        payload: { id: r.id },
      });
    });
  }

  exportDetail(id) {
    this.props.dispatch({
      type: 'purchaseStorage/exportDetail',
      payload: { id },
    });
  }

  closeDetailModal() {
    this.props.dispatch({ type: 'purchaseStorage/clearEditInfo' });
    setTimeout(() => {
      this.setState({ showDetail: false });
    }, 0);
  }

  render() {
    const p = this;
    const { form, list = [], total, buyer = [], wareList = [], showModal, editInfo = {}, buyerTaskList = [] } = p.props;
    const { selectedRowKeys, showDetail } = p.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columnsList = [
      { title: '入库单号', dataIndex: 'stoOrderNo', key: 'stoOrderNo' },
      { title: '买手姓名', dataIndex: 'buyerName', key: 'buyerName' },
      { title: '操作员名字', dataIndex: 'userCreate', key: 'userCreate' },
      { title: '仓库名称', dataIndex: 'warehouseName', key: 'warehouseName' },
      { title: '新增时间', dataIndex: 'gmtCreate', key: 'gmtCreate', render(t) { return t && t.split(' ')[0]; } },
      { title: '修改时间', dataIndex: 'gmtModify', key: 'gmtModify', render(t) { return t && t.split(' ')[0]; } },
      { title: '入库时间', dataIndex: 'putInDate', key: 'putInDate', render(t) { return (t && t.split(' ')[0]) || '-'; } },
      { title: '状态', dataIndex: 'status', key: 'status', render(text) { return text === 0 ? '未入库' : '已入库'; } },
      { title: '备注', dataIndex: 'remark', key: 'remark', render(t) { return t || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 160,
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" onClick={p.queryDetail.bind(p, record)} style={{ marginRight: 10 }}>查看</a>
              <a href="javascript:void(0)" style={{ margin: '0 10px 0 0' }} onClick={p.showModal.bind(p, 'update', record.id)}>修改</a>
              <Popconfirm title="确认删除？" onConfirm={p.handleDelete.bind(p, record.id)} >
                <a href="javascript:void(0)" style={{ marginRight: 10 }}>删除</a>
              </Popconfirm>
              <a href="javascript:void(0)" onClick={p.exportDetail.bind(p, record.id)} >导出</a>
            </div>);
        },
      },
    ];

    const columnsStorageList = [
      { title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 50 },
      { title: 'UPC', dataIndex: 'upc', key: 'upc', width: 50 },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 100 },
      { title: '图片',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: 80,
        render(t) {
          if (t) {
            const picObj = JSON.parse(t);
            const picList = picObj.picList;
            if (picList.length) {
              const imgUrl = picList[0].url;
              return (
                <Popover title={null} content={<img role="presentation" src={imgUrl} style={{ width: 400 }} />}>
                  <img role="presentation" src={imgUrl} width={60} height={60} />
                </Popover>
              );
            }
          }
          return '-';
        },
      },
      { title: '颜色', dataIndex: 'color', key: 'color', width: 60 },
      { title: '规格', dataIndex: 'scale', key: 'scale', width: 80 },
      { title: '计划采购数', dataIndex: 'taskDailyCount', key: 'taskDailyCount', width: 60 },
      { title: '入库数', dataIndex: 'quantity', key: 'quantity', width: 70, render(t) { return t || 0; } },
      { title: '在途入库数', dataIndex: 'transQuantity', key: 'transQuantity', width: 70, render(t) { return t || 0; } },
      { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
      { title: '货架号', dataIndex: 'shelfNo', key: 'shelfNo', width: 100 },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };

    const paginationProps = {
      total,
      pageSize: 20,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
      },
    };

    const detailList = editInfo.purchaseStorageDetailList;
    if (detailList && detailList.length) {
      detailList.push({
        skuCode: <font color="#00f" >明细合计</font>,
        quantity: editInfo.totalQuantity,
        transQuantity: editInfo.totalTransQuantity,
        taskDailyCount: editInfo.totalTaskDailyCount,
      });
    }

    return (
      <div>
        <div className="refresh-btn"><Button type="ghost" size="small" onClick={this._refreshData.bind(this)}>刷新</Button></div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="买手"

                {...formItemLayout}
              >
                {getFieldDecorator('buyerId', {})(
                  <Select placeholder="请选择用户" optionLabelProp="title" combobox allowClear>
                    {buyer.map(el => <Option key={el.id} title={el.name}>{el.name}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="入库单号"

                {...formItemLayout}
              >
                {getFieldDecorator('stoOrderNo', {})(
                  <Input placeholder="请输入入库单号" />)}
              </FormItem>
            </Col>
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
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col style={{ marginLeft: 6 }}>
              <FormItem
                label="订单时间"
                labelCol={{ span: 3 }}
              >
                {getFieldDecorator('orderDate', {})(<DatePicker.RangePicker />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col style={{ marginLeft: 6 }}>
              <FormItem
                label="入库时间"
                labelCol={{ span: 3 }}
              >
                {getFieldDecorator('storageDate', {})(<DatePicker.RangePicker />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className="listBtnGroup" style={{ marginLeft: 14 }}>
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={this.handleEmpty.bind(this)}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col className="operBtn">
            <Button type="primary" size="large" onClick={this.showModal.bind(this, 'add')}>新增入库</Button>
            <Button type="primary" size="large" onClick={this.batchStorage.bind(this)} style={{ float: 'right' }} disabled={selectedRowKeys.length === 0}>批量入库</Button>
          </Col>
          <Row>
            <Col>
              <Table
                columns={columnsList}
                dataSource={list}
                bordered
                size="large"
                rowKey={record => record.id}
                pagination={paginationProps}
                rowSelection={rowSelection}
              />
            </Col>
          </Row>
        </Row>
        <Modal
          visible={showDetail}
          title="详情"
          footer={null}
          width={900}
          onCancel={this.closeDetailModal.bind(this)}
        >
          <Table columns={columnsStorageList} pagination={false} dataSource={editInfo.purchaseStorageDetailList} rowKey={r => r.id} bordered scroll={{ y: 400 }} />
        </Modal>
        <PurchaseStorageModal
          visible={showModal}
          title={Object.keys(editInfo).length > 0 ? '修改入库单' : '新增入库单'}
          buyer={buyer}
          wareList={wareList}
          buyerTaskList={buyerTaskList}
          purchaseStorageData={editInfo}
          isShowDetail={showDetail}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list, total, buyer, showModal, editInfo, buyerTaskList } = state.purchaseStorage;
  const { wareList } = state.inventory;
  return {
    list, total, buyer, wareList, showModal, editInfo, buyerTaskList,
  };
}

export default connect(mapStateToProps)(Form.create()(PurchaseStorage));
