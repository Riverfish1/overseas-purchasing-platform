import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Input, DatePicker, Button, Row, Col, Select, Form, Modal } from 'antd';
import PurchaseModal from './PurchaseModal';
import styles from './Purchase.less';

const FormItem = Form.Item;
const { Option } = Select;

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

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (fieldsValue.taskEndTime) fieldsValue.taskEndTime = new Date(fieldsValue.taskEndTime).format('yyyy-MM-dd');
      this.props.dispatch({
        type: 'purchase/queryPurchaseList',
        payload: { ...fieldsValue, pageIndex: 1 },
      });
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
      title: '新增',
    }, () => {
      this.props.dispatch({
        type: 'sku/querySkuList',
        payload: {},
      });
    });
  }

  updateModal(id) {
    window.event.stopPropagation();
    const p = this;
    p.setState({
      modalVisible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({ type: 'purchase/queryPurchase', payload: { id } });
      p.props.dispatch({ type: 'sku/querySkuList', payload: {} });
    });
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
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

  handleCancel() {
    this.setState({ previewVisible: false });
  }

  handleBigPic(value) {
    if (value) {
      this.setState({
        previewVisible: true,
        previewImage: value,
      });
    }
  }

  render() {
    const p = this;
    const { form, list = [], total, purchaseValues = {}, buyer = [], skuList = [], dispatch } = p.props;
    const { getFieldDecorator, getFieldsValue, resetFields } = form;
    const { title, previewImage, previewVisible } = p.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columnsList = [
      { title: '任务单号', dataIndex: 'taskOrderNo', key: 'taskOrderNo' },
      { title: '任务名称', dataIndex: 'taskTitle', key: 'taskTitle' },
      { title: '任务描述', dataIndex: 'taskDesc', key: 'taskDesc' },
      { title: '任务分配人', dataIndex: 'taskOwnerName', key: 'taskOwnerName' },
      { title: '买手', dataIndex: 'taskUserName', key: 'taskUserName' },
      { title: '图片',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render(t) {
          return t ? <img role="presentation" onClick={p.handleBigPic.bind(p, t)} src={t} width="50" height="50" style={{ cursor: 'pointer' }} /> : '-';
        },
      },
      { title: '采购类型',
        dataIndex: 'purType',
        key: 'purType',
        render(t) {
          if (t === 0) {
            return <span>订单采购</span>;
          } else if (t === 1) {
            return <span>囤货采购</span>;
          }
          return '-';
        },
      },
      { title: '任务开始时间', dataIndex: 'taskStartTime', key: 'taskStartTime' },
      { title: '任务结束时间', dataIndex: 'taskEndTime', key: 'taskEndTime' },
      { title: '备注', dataIndex: 'remark', key: 'remark' },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 160,
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ margin: '0 10px 0 0' }} onClick={p.updateModal.bind(p, record.id)}>修改</a>
              {/* <Popconfirm title="确认删除？" onConfirm={p.handleDelete.bind(p, record)} >
                <a href="javascript:void(0)" >删除</a>
              </Popconfirm>*/}
            </div>);
        },
      },
    ];

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
          type: 'purchase/queryPurchaseList',
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
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="买手"
                {...formItemLayout}
              >
                {getFieldDecorator('userId', {})(
                  <Select placeholder="请选择用户" combobox>
                    {buyer.map(el => <Option key={el.id} value={el.id.toString()}>{el.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="采购结束日期"
                {...formItemLayout}
              >
                {getFieldDecorator('taskEndTime', {})(
                  <DatePicker />,
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
          <Col className={styles.orderBtn}>
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
        <Modal visible={previewVisible} title="预览图片" footer={null} onCancel={this.handleCancel.bind(this)}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <PurchaseModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={purchaseValues}
          title={title}
          buyer={buyer}
          skuList={skuList}
          dispatch={dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list, total, purchaseValues, buyer, skuList } = state.purchase;
  return {
    list,
    total,
    purchaseValues,
    buyer,
    skuList,
  };
}

export default connect(mapStateToProps)(Form.create()(Purchase));
