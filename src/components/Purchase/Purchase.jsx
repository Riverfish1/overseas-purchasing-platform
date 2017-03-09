
import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Table, Popover, Input, DatePicker, Button, Row, Col, Select, Form, Modal } from 'antd';
import PurchaseModal from './PurchaseModal';
import styles from './Purchase.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class Purchase extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      visible: false,
      title: '', // modal的title
      updateId: [], // 修改商品传的id
      range: false,
    };
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
      type: 'purchase/updatePurchase',
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

  selectDate(value) {
    if (value === 'range') this.setState({ range: true });
    else this.setState({ range: false });
  }

  render() {
    const p = this;
    const { form, list = {}, purchaseValues = {}, orderSkuSnip = {} } = p.props;
    const { getFieldDecorator, getFieldsValue, resetFields } = form;
    const { title, visible, range } = p.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columnsList = [
      {
        title: '采购单号', dataIndex: 'purchaseNo', key: 'purchaseNo',
      },
      {
        title: '采购类型', dataIndex: 'type', key: 'type',
      },
      {
        title: '计划完成时间', dataIndex: 'time', key: 'time',
      },
      {
        title: '采购状态', dataIndex: 'status', key: 'status',
      },
      {
        title: '支付方式', dataIndex: 'style', key: 'style',
      },
      {
        title: '备注', dataIndex: 'remarks', key: 'remarks',
      },
      {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 160,
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" onClick={p.handleProDetail.bind(p, record)}>查看SKU</a>
              <a href="javascript:void(0)" style={{ margin: '0 10px' }} onClick={p.updateModal.bind(p, record.id)}>修改</a>
              <Popover title={null} content={orderStatusContent}>
                <a href="javascript:void(0)" >状态操作</a>
              </Popover>
            </div>);
        },
      },
    ];

    const listPaginationProps = {
      total: list && list.totalCount,
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
      title: `订单编号：${(orderSkuSnip.data && orderSkuSnip.data.orderNo) || '加载中'}`,
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
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="采购单号"
                {...formItemLayout}
              >
                {getFieldDecorator('purchaseNo', {})(
                  <Input placeholder="请输入采购单号" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="采购类型"
                {...formItemLayout}
              >
                {getFieldDecorator('purchaseType', {})(
                  <Select placeholder="请选择采购类型" >
                    <Option value="all">所有</Option>
                    <Option value="2">订单采购</Option>
                    <Option value="3">囤货采购</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="采购单状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {})(
                  <Select placeholder="请选择采购单状态" >
                    <Option value="all">不限</Option>
                    <Option value="2">采购中</Option>
                    <Option value="3">采购完成</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="支付方式"
                {...formItemLayout}
              >
                {getFieldDecorator('style', {})(
                  <Select placeholder="请选择支付方式">
                    <Option value="all">不限</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="买手"
                {...formItemLayout}
              >
                {getFieldDecorator('customer', {})(
                  <Select placeholder="请选择用户">
                    <Option value="1">所有</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="计划完成日期"
                {...formItemLayout}
              >
                {getFieldDecorator('date', {})(
                  <Select placeholder="请选择日期" onChange={this.selectDate.bind(this)}>
                    <Option value="all">任意时间</Option>
                    <Option value="lw">上周</Option>
                    <Option value="tw">本周</Option>
                    <Option value="lm">上月</Option>
                    <Option value="tm">本月</Option>
                    <Option value="ly">去年</Option>
                    <Option value="ty">今年</Option>
                    <Option value="range">时间段</Option>
                  </Select>,
                )}
                {range && getFieldDecorator('datePicker', {})(
                  <RangePicker style={{ width: 180 }} />,
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
              dataSource={list && list.data}
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
            scroll={{ x: 1200 }}
          />
        </Modal>
        <PurchaseModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
          modalValues={purchaseValues}
          title={title}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list, purchaseValues } = state.purchase;
  return {
    list,
    purchaseValues,
  };
}

Purchase.PropTypes = {
  list: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Form.create()(Purchase));
