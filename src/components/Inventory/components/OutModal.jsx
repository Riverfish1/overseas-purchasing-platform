import React, { Component } from 'react';
import { Form, Input, Select, Popover, Modal, Row, Col, Button, Table } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

class OutModal extends Component {
  constructor() {
    super();
    this.state = {
      outDetailList: [{ inventoryAreaId: '', quantity: '' }],
      checkId: [],
    };
  }
  handleCancel() {
    const { form, close } = this.props;
    form.resetFields();
    close();
  }
  handleConfirmOut() {}
  addEmptyLine() {
    const { outDetailList } = this.state;
    outDetailList.push({ inventoryAreaId: '', quantity: '' });
    this.setState({ outDetailList });
  }
  doSearch() {
    this.props.dispatch({
      type: 'inventory/queryInventoryList',
      payload: {
        itemName: this.itemName && this.itemName.refs.input.value,
      },
    });
  }
  inputChange(type, e, index) {
    const { outDetailList } = this.state;
    if (type === 'quantity') {
      outDetailList[index].quantity = e.target.value;
    }
    this.setState({ outDetailList });
  }
  render() {
    const p = this;
    const { visible, wareList = [], form, data = {}, list = [] } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };
    const columns = [
      { title: 'SKU代码', key: 'skuCode', dataIndex: 'skuCode', width: 150 },
      { title: '商品名称', key: 'itemName', dataIndex: 'itemName', width: 200 },
      { title: '商品图片',
        key: 'skuPic',
        dataIndex: 'skuPic',
        width: 88,
        render(text) {
          if (!text) return '-';
          const picList = JSON.parse(text).picList;
          const t = picList.length ? picList[0].url : '';
          return (
            t ? <Popover title={null} content={<img role="presentation" src={t} style={{ width: 400 }} />}>
              <img role="presentation" src={t} width={60} height={60} />
            </Popover> : '-'
          );
        },
      },
      { title: '仓库名称', key: 'warehouseName', dataIndex: 'warehouseName', width: 100 },
      { title: 'UPC', key: 'upc', dataIndex: 'upc', width: 100 },
      { title: '颜色', key: 'color', dataIndex: 'color', width: 80 },
      { title: '尺寸', key: 'scale', dataIndex: 'scale', width: 80 },
      { title: '可售库存', key: 'totalAvailableInv', dataIndex: 'totalAvailableInv', width: 80 },
      { title: '现货库存', key: 'inventory', dataIndex: 'inventory', sorter: true, width: 80 },
      { title: '现货占用', key: 'lockedInv', dataIndex: 'lockedInv', sorter: true, width: 80 },
      { title: '在途库存', key: 'transInv', dataIndex: 'transInv', sorter: true, width: 80 },
      { title: '在途占用', key: 'lockedTransInv', dataIndex: 'lockedTransInv', sorter: true, width: 80 },
      { title: '货架号', key: 'positionNo', dataIndex: 'positionNo', width: 60 },
    ];
    const paginationProps = {
      total: list.length,
      onChange(pageIndex) {
        p.props.dispatch({
          type: 'inventory/queryInventoryList',
          payload: { pageIndex },
        });
      },
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
    const inventoryContent = (
      <div style={{ width: 800 }}>
        <Row style={{ width: 720 }}>
          <Col span="7">
            <FormItem
              label="商品名称"
              {...formItemLayout}
            >
              <Input
                size="default"
                placeholder="请输入商品名称"
                ref={(c) => { p.itemName = c; }}
              />
            </FormItem>
          </Col>
          <Col className="listBtnGroup" span="3" style={{ marginTop: 2 }}>
            <Button type="primary" onClick={p.doSearch.bind(p)}>查询</Button>
          </Col>
        </Row>
        <Row>
          <Table
            columns={columns}
            dataSource={list}
            rowSelection={rowSelection}
            size="small"
            bordered
            rowKey={record => record.id}
            pagination={paginationProps}
            scroll={{ y: 400 }}
          />
        </Row>
      </div>
    );
    const modalTableProps = {
      columns: [
        { title: '货架号ID',
          dataIndex: 'inventoryAreaId',
          key: 'inventoryAreaId',
          render(t) {
            return (
              <FormItem>
                {getFieldDecorator('inventoryAreaId', {
                  initialValue: t,
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Popover
                    content={inventoryContent}
                    title="选择明细"
                    trigger="click"
                  >
                    <Input placeholder="请选择" />
                  </Popover>,
                )}
              </FormItem>
            );
          },
        },
        { title: 'SKU数量',
          dataIndex: 'quantity',
          key: 'quantity',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator('quantity', {
                  initialValue: t,
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <Input placeholder="请输入" onChange={p.inputChange.bind(p, 'quantity')} />,
                )}
              </FormItem>
            );
          },
        },
      ],
    };
    return (
      <Modal
        visible={visible}
        title="出库明细"
        onCancel={this.handleCancel.bind(this)}
        onOk={this.handleConfirmOut.bind(this)}
        maskClosable={false}
      >
        <Form>
          <FormItem
            label="仓库名称"
            {...formItemLayout}
          >
            {getFieldDecorator('warehouseName', {
              initialValue: data.warehouseName,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select placeholder="请选择">
                {wareList.map(el => <Option key={el.name}>{el.name}</Option>)}
              </Select>,
            )}
          </FormItem>
          <FormItem
            label="仓库名称"
            {...formItemLayout}
          >
            {getFieldDecorator('remark', {
              initialValue: data.remark,
            })(
              <Input placeholder="请输入" />,
            )}
          </FormItem>
          <Row style={{ paddingBottom: 10 }}>
            <Col style={{ float: 'left' }}>
              <span>出库单明细</span>
            </Col>
            <Col style={{ float: 'right' }}>
              <Button type="primary" onClick={p.addEmptyLine.bind(p)}>添加出库明细</Button>
            </Col>
          </Row>
          <Table {...modalTableProps} rowKey={record => record.key} />
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps({ inventory }) {
  const { wareList, list } = inventory;
  return { wareList, list };
}

export default connect(mapStateToProps)(Form.create()(OutModal));
