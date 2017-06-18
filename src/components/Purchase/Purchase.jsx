import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, DatePicker, Button, Row, Col, Select, Form, Popconfirm, Popover, Modal } from 'antd';
import PurchaseModal from './PurchaseModal';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@window.regStateCache
class Purchase extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      title: '', // modal的title
      previewImage: '',
      previewVisible: false,
      taskDailyIds: [],
      isNotSelected: true,
    };
  }

  handleSubmit(e, page) {
    const p = this;
    if (e) e.preventDefault();
    p.setState({ taskDailyIds: [] }, () => {
      this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        if (err) {
          return;
        }
        if (fieldsValue.taskStart && fieldsValue.taskStart[0] && fieldsValue.taskStart[1]) {
          fieldsValue.taskStart1 = new Date(fieldsValue.taskStart[0]).format('yyyy-MM-dd');
          fieldsValue.taskStart2 = new Date(fieldsValue.taskStart[1]).format('yyyy-MM-dd');
        }
        if (fieldsValue.taskEnd && fieldsValue.taskEnd[0] && fieldsValue.taskEnd[1]) {
          fieldsValue.taskEnd1 = new Date(fieldsValue.taskEnd[0]).format('yyyy-MM-dd');
          fieldsValue.taskEnd2 = new Date(fieldsValue.taskEnd[1]).format('yyyy-MM-dd');
        }
        delete fieldsValue.taskStart;
        delete fieldsValue.taskEnd;
        this.props.dispatch({
          type: 'purchase/queryPurchaseList',
          payload: { ...fieldsValue, pageIndex: typeof page === 'number' ? page : 1 },
        });
      });
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
      title: '新增',
    });
  }

  updateModal(id, e) {
    e.stopPropagation();
    const p = this;
    p.setState({
      modalVisible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({ type: 'purchase/queryPurchase', payload: { id } });
    });
  }

  closeModal(modalVisible) {
    this.setState({ modalVisible });
    this.props.dispatch({
      type: 'purchase/savePurchase',
      payload: {},
    });
  }

  handleDelete(record) {
    this.props.dispatch({
      type: 'purchase/deletePurchase',
      payload: { id: record.id },
    });
  }

  handleBigPic(value) {
    if (value) {
      this.setState({
        previewImage: value,
      });
    }
  }

  exportPurchase(id) { // 导出采购单
    this.props.dispatch({
      type: 'purchase/exportPurchase',
      payload: { id },
    });
  }

  handlePurchaseAction(type) {
    const p = this;
    const { taskDailyIds } = this.state;
    switch (type) {
      case 'finish':
        Modal.confirm({
          title: '完成采购',
          content: '确定完成采购？',
          onOk() {
            p.props.dispatch({
              type: 'purchase/finishTaskDaily',
              payload: { taskDailyIds: JSON.stringify(taskDailyIds) },
              success() {
                p.props.dispatch({
                  type: 'purchase/queryPurchaseList',
                  payload: {},
                });
              },
            });
          },
        });
        break;
      case 'close':
        Modal.confirm({
          title: '取消采购',
          content: '确定取消采购？',
          onOk() {
            p.props.dispatch({
              type: 'purchase/closeTaskDaily',
              payload: { taskDailyIds: JSON.stringify(taskDailyIds) },
              success() {
                p.props.dispatch({
                  type: 'purchase/queryPurchaseList',
                  payload: {},
                });
              },
            });
          },
        });
        break;
      default: return false;
    }
  }

  render() {
    const p = this;
    const { form, list = [], total, purchaseValues = {}, buyer = [], dispatch } = p.props;
    const { getFieldDecorator, resetFields } = form;
    const { title, previewImage, isNotSelected } = p.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const content = (
      <img role="presentation" src={previewImage} style={{ width: 400 }} />
    );
    const columnsList = [
      { title: '任务单号', dataIndex: 'taskOrderNo', key: 'taskOrderNo', width: 150 },
      { title: '任务名称', dataIndex: 'taskTitle', key: 'taskTitle', width: 150 },
      { title: '任务描述', dataIndex: 'taskDesc', key: 'taskDesc', width: 80 },
      // { title: '任务分配人', dataIndex: 'ownerName', key: 'ownerName' },
      { title: '买手', dataIndex: 'buyerName', key: 'buyerName', width: 60, render(text) { return text || '-'; } },
      { title: '图片',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 80,
        render(text) {
          if (text) {
            return (
              <Popover title={null} content={content}>
                <img role="presentation" onMouseEnter={p.handleBigPic.bind(p, text)} src={text} width="50" height="50" />
              </Popover>
            );
          }
          return '-';
        },
      },
      { title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 60,
        render(t) {
          switch (t) {
            case 0: return '采购中';
            case 1: return '已完成';
            case -1: return '已取消';
            default: return '-';
          }
        },
      },
      { title: '任务开始时间', dataIndex: 'taskStartTime', key: 'taskStartTime', width: 150, render(t) { return t ? t.slice(0, 11) : '-'; } },
      { title: '任务结束时间', dataIndex: 'taskEndTime', key: 'taskEndTime', width: 150, render(t) { return t ? t.slice(0, 11) : '-'; } },
      { title: '备注', dataIndex: 'remark', key: 'remark', width: 100, render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 160,
        render(t, r) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={p.updateModal.bind(p, r.id)}>修改</a>
              <Popconfirm title="确认删除？" onConfirm={p.handleDelete.bind(p, r)} >
                <a style={{ marginRight: 10 }} href="javascript:void(0)" >删除</a>
              </Popconfirm>
              <a href="javascript:void(0)" onClick={p.exportPurchase.bind(p, r.id)}>导出</a>
            </div>);
        },
      },
    ];

    const paginationProps = {
      total,
      pageSize: 20,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
      },
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const listId = [];
        if (selectedRows.length) p.setState({ isNotSelected: false });
        else p.setState({ isNotSelected: true });
        selectedRows.forEach((el) => {
          listId.push(el.id);
        });
        p.setState({ taskDailyIds: listId });
      },
      selectedRowKeys: p.state.taskDailyIds,
    };
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="任务单号"
                {...formItemLayout}
              >
                {getFieldDecorator('taskOrderNo', {})(
                  <Input placeholder="请输入任务单号" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="任务名称"
                {...formItemLayout}
              >
                {getFieldDecorator('taskTitle', {})(
                  <Input placeholder="请输入任务名称" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="买手"
                {...formItemLayout}
              >
                {getFieldDecorator('buyerId', {})(
                  <Select placeholder="请选择用户" optionLabelProp="title" combobox>
                    {buyer.map(el => <Option key={el.id} title={el.name}>{el.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800, marginLeft: -6 }}>
            <Col>
              <FormItem
                label="开始时间范围"
                {...formItemLayout}
                labelCol={{ span: 3 }}
              >
                {getFieldDecorator('taskStart')(<RangePicker />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800, marginLeft: -6 }}>
            <Col>
              <FormItem
                label="结束时间范围"
                {...formItemLayout}
                labelCol={{ span: 3 }}
              >
                {getFieldDecorator('taskEnd')(<RangePicker />)}
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
        <Row>
          <Col className="operBtn" span="20">
            <Button type="primary" size="large" onClick={p.showModal.bind(p)}>新增采购</Button>
          </Col>
          <Col span="2" className="operBtn">
            <Button type="primary" size="large" disabled={isNotSelected} onClick={p.handlePurchaseAction.bind(p, 'finish')}>完成采购</Button>
          </Col>
          <Col span="2" className="operBtn">
            <Button size="large" disabled={isNotSelected} onClick={p.handlePurchaseAction.bind(p, 'close')}>取消采购</Button>
          </Col>
        </Row>
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
        <PurchaseModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={purchaseValues}
          title={title}
          buyer={buyer}
          dispatch={dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list, total, purchaseValues, buyer } = state.purchase;
  return {
    list,
    total,
    purchaseValues,
    buyer,
  };
}

export default connect(mapStateToProps)(Form.create()(Purchase));
