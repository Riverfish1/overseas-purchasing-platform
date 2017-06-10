import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, DatePicker, Button, Row, Col, Select, Form, Popconfirm, Popover } from 'antd';
import PurchaseModal from './PurchaseModal';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class Purchase extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      title: '', // modal的title
      previewImage: '',
      previewVisible: false,
    };
  }

  handleSubmit(e, page) {
    if (e) e.preventDefault();
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

  render() {
    const p = this;
    const { form, list = [], total, purchaseValues = {}, buyer = [], dispatch } = p.props;
    const { getFieldDecorator, resetFields } = form;
    const { title, previewImage } = p.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const content = (
      <img role="presentation" src={previewImage} style={{ width: 400 }} />
    );
    const columnsList = [
      { title: '任务单号', dataIndex: 'taskOrderNo', key: 'taskOrderNo' },
      { title: '任务名称', dataIndex: 'taskTitle', key: 'taskTitle' },
      { title: '任务描述', dataIndex: 'taskDesc', key: 'taskDesc' },
      // { title: '任务分配人', dataIndex: 'ownerName', key: 'ownerName' },
      // { title: '分配者ID', dataIndex: 'ownerId', key: 'ownerId' },
      { title: '买手', dataIndex: 'buyerName', key: 'buyerName', render(text) { return text || '-'; } },
      { title: '图片',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
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
      { title: '任务开始时间', dataIndex: 'taskStartTime', key: 'taskStartTime' },
      { title: '任务结束时间', dataIndex: 'taskEndTime', key: 'taskEndTime' },
      { title: '备注', dataIndex: 'remark', key: 'remark', render(text) { return text || '-'; } },
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
          <Col className="operBtn">
            <Button type="primary" size="large" onClick={p.showModal.bind(p)}>新增采购</Button>
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
