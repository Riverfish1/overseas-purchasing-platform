import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Select, DatePicker, Form, Popconfirm, Modal } from 'antd';
import PurchaseStorageModal from './PurchaseStorageModal';

const FormItem = Form.Item;
const Option = Select.Option;

class PurchaseStorage extends Component {

  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],
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
        console.log(p.state.selectedRowKeys);
        p.props.dispatch({ type: 'purchaseStorage/multiConfirmStorage', payload: { ids: p.state.selectedRowKeys } });
        p.setState({ selectedRowKeys: [] });
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    // 清除多选
    this.setState({ selectedRowKeys: [] }, () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }
        if (values.orderDate) {
          values.startTime = new Date(values.orderDate[0]).format('yyyy-MM-dd');
          values.endTime = new Date(values.orderDate[1]).format('yyyy-MM-dd');
          delete values.orderDate;
        }
        if (values.storageDate) {
          values.putInStart = new Date(values.storageDate[0]).format('yyyy-MM-dd');
          values.putInEnd = new Date(values.storageDate[1]).format('yyyy-MM-dd');
          delete values.storageDate;
        }
        console.log(values);
        this.props.dispatch({
          type: 'purchaseStorage/queryPurchaseStorageList',
          payload: { ...values, pageIndex: 1 },
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
    console.log(id);
    this.setState({
      modalVisible: true,
    }, () => {
      p.props.dispatch({ type: 'products/queryProduct', payload: { id } });
    });
  }

  render() {
    const p = this;
    const { form, list = [], total, buyer = [], wareList = [], showModal, editInfo = {}, buyerTaskList = [] } = p.props;
    const { selectedRowKeys } = p.state;
    const { getFieldDecorator, getFieldsValue } = form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columnsList = [
      { title: '入库单号', dataIndex: 'stoOrderNo', key: 'stoOrderNo' },
      { title: '买手姓名', dataIndex: 'buyerName', key: 'buyerName' },
      { title: '仓库名称', dataIndex: 'warehouseName', key: 'warehouseName' },
      { title: '备注', dataIndex: 'remark', key: 'remark', render(t) { return t || '-'; } },
      { title: '新增时间', dataIndex: 'gmtCreate', key: 'gmtCreate', render(t) { return t && t.split(' ')[0]; } },
      { title: '修改时间', dataIndex: 'gmtModify', key: 'gmtModify', render(t) { return t && t.split(' ')[0]; } },
      { title: '入库时间', dataIndex: 'putInDate', key: 'putInDate', render(t) { return (t && t.split(' ')[0]) || '-'; } },
      { title: '状态', dataIndex: 'status', key: 'status', render(text) { return text === 0 ? '未入库' : '已入库'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 160,
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ margin: '0 10px 0 0' }} onClick={p.showModal.bind(p, 'update', record.id)}>修改</a>
              <Popconfirm title="确认删除？" onConfirm={p.handleDelete.bind(p, record.id)} >
                <a href="javascript:void(0)" >删除</a>
              </Popconfirm>
            </div>);
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };

    const paginationProps = {
      total,
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
          type: 'purchaseStorage/queryPurchaseStorageList',
          payload: { ...payload, pageIndex: page },
        });
      },
    };

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="买手"

                {...formItemLayout}
              >
                {getFieldDecorator('buyerId', {})(
                  <Select placeholder="请选择用户" optionLabelProp="title" combobox>
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
                  <Select placeholder="请选择仓库" optionLabelProp="title" combobox>
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

        <PurchaseStorageModal
          visible={showModal}
          title={Object.keys(editInfo).length > 0 ? '修改入库单' : '新增入库单'}
          buyer={buyer}
          wareList={wareList}
          buyerTaskList={buyerTaskList}
          purchaseStorageData={editInfo}
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
