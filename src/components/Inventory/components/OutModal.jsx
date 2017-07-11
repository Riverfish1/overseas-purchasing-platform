import React, { Component } from 'react';
import { Form, Input, Select, Popover, Modal, Row, Col, Button, Table, Popconfirm } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

let latestSearch = {};
let isAdditional = false; // 是否追加
let isOperating = false; // 是否正在添加


class OutModal extends Component {
  constructor() {
    super();
    this.state = {
      outDetailList: [],
      checkId: [],
    };
  }
  handleCancel() {
    const { form, close } = this.props;
    form.resetFields();
    close();
  }
  handleConfirmOut() {}
  addEmptyLine(num) {
    let { outDetailList } = this.state;
    if (!outDetailList) outDetailList = [];
    const skuLen = outDetailList ? outDetailList.length : 0;
    const lastId = skuLen < 1 ? 0 : outDetailList[outDetailList.length - 1].key;
    const looptime = typeof num === 'number' ? num : 1;

    let currentId = parseInt(lastId, 10);
    for (let i = 0; i < looptime; i += 1) {
      currentId += 1;
      const newId = currentId;
      const newItem = {
        id: '',
        key: newId,
        skuCode: '',
        skuId: '',
        itemName: '',
        color: '',
        scale: '',
        warehouseName: '',
        upc: '',
        positionNo: '',
      };
      outDetailList.push(newItem);
    }
    this.setState({ outDetailList }, () => {
      if (typeof num !== 'boolean') {
        setTimeout(() => {
          this[`r_${currentId}_skuCode`].focus();
          this[`r_${currentId}_skuCode`].refs.input.click();
        }, 0);
      }
    });
  }
  batchAddProduct(props) {
    console.log(props);
    let { outDetailList } = this.state;
    if (!outDetailList) outDetailList = [];
    const skuLen = outDetailList ? outDetailList.length : 0;
    const lastId = skuLen < 1 ? 0 : outDetailList[outDetailList.length - 1].key;
    const looptime = props.length;

    const batchUpdateFormValues = {};

    let currentId = parseInt(lastId, 10);

    // 本次是否有新增
    let isAddedItem = false;

    // 当前先选择一把
    // 检验重复
    let isDuplicatedFirst = false;
    for (let j = 0; j < outDetailList.length; j += 1) {
      if (outDetailList[j].skuCode.toString() === props[0].skuCode.toString()) {
        isDuplicatedFirst = true;
        break;
      }
    }
    if (!isDuplicatedFirst) {
      // 不重复则先新增第一个
      if (isAdditional) {
        this.addEmptyLine(true);
        currentId += 1;
        props.forEach((prop) => {
          prop.key += 1;
        });
        props[0].key = outDetailList[outDetailList.length - 1].key;
      }

      isAddedItem = true;
      this.props.list.forEach((value) => {
        console.log(value);
        if (value.skuCode.toString() === props[0].skuCode.toString()) {
          outDetailList.forEach((el) => {
            console.log(el.key, props[0].key);
            if (el.key.toString() === props[0].key.toString()) {
              el.skuId = value.id;
              el.skuCode = value.skuCode;
              el.skuPic = value.skuPic;
            }
          });
          // console.log('first value: ', value);
          batchUpdateFormValues[`r_${props[0].key}_skuId`] = value.id;
          batchUpdateFormValues[`r_${props[0].key}_skuCode`] = value.skuCode;
        }
      });
    }

    // 再进行追加
    for (let i = 1; i < looptime; i += 1) {
      // 检验重复
      let isDuplicated = false;
      for (let j = 0; j < outDetailList.length; j += 1) {
        if (outDetailList[j].skuCode.toString() === props[i].skuCode.toString()) {
          isDuplicated = true;
          break;
        }
      }
      if (!isDuplicated) {
        isAddedItem = true;

        currentId += 1;
        const newId = outDetailList[outDetailList.length - 1].key + 1;
        const newItem = {
          id: '',
          key: newId,
          skuCode: '',
          skuId: '',
          itemName: '',
          color: '',
          scale: '',
          warehouseName: '',
          upc: '',
          positionNo: '',
        };

        this.props.list.forEach((value) => {
          console.log(value, props[i]);
          if (value.skuCode.toString() === props[i].skuCode.toString()) {
            newItem.skuId = value.id;
            newItem.skuCode = value.skuCode;
            newItem.skuPic = value.skuPic;
            // console.log('value: ', value);

            batchUpdateFormValues[`r_${newId}_skuId`] = value.id;
            batchUpdateFormValues[`r_${newId}_skuCode`] = value.skuCode;
          }
        });

        outDetailList.push(newItem);
      }
    }

    this.setState({ outDetailList }, () => {
      this.props.form.setFieldsValue(batchUpdateFormValues);
      setTimeout(() => {
        // this[`r_${key}_skuCode`].refs.input.click();
        setTimeout(() => {
          // this.clearSelectedSku();
          this.setState({ selectedSku: [] }, () => { isOperating = false; });
          if (isAddedItem) isAdditional = true;
        }, 300);
      }, 0);
    });
  }
  doSearch() {
    latestSearch = {
      itemName: this.itemName && this.itemName.refs.input.value,
      skuCode: this.skuCode && this.skuCode.refs.input.value,
      upc: this.upc && this.upc.refs.input.value,
    };
    this.props.dispatch({
      type: 'inventory/queryList',
      payload: {
        ...latestSearch,
      },
    });
  }
  handleDeleteDetail(key) {
    const newData = this.state.outDetailList.filter(el => el.key !== key);
    this.setState({ outDetailList: newData });
  }
  handleBatchAdd(key) {
    if (!isOperating) {
      isOperating = true;
      const { checkId } = this.state;
      const batchSelectParams = [];
      setTimeout(() => {
        let j = -1;
        for (let i = 0; i < checkId.length; i += 1) {
          j += 1;

          batchSelectParams.push({ key: key + j, skuCode: checkId[i].skuCode });
        }
        if (batchSelectParams.length > 0) this.batchAddProduct(batchSelectParams, key);
        else isOperating = false;
      }, 0);
    } else {
      console.log('执行中无法操作');
    }
  }
  clearValue() {
    const { form } = this.props;
    this.setState({ outDetailList: undefined }, () => {
      form.resetFields();
    });
  }
  clearSelected(visible) {
    if (!visible) {
      this.setState({ checkId: [] });
      isAdditional = false;
      isOperating = false;
    }
  }
  render() {
    const p = this;
    const { visible, wareList = [], form, data = {}, list = [], total } = this.props;
    const { getFieldDecorator } = form;
    const { outDetailList } = this.state;
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
        width: 90,
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
      { title: '现货库存', key: 'inventory', dataIndex: 'inventory', width: 80 },
      { title: '现货占用', key: 'lockedInv', dataIndex: 'lockedInv', width: 80 },
      { title: '在途库存', key: 'transInv', dataIndex: 'transInv', width: 80 },
      { title: '在途占用', key: 'lockedTransInv', dataIndex: 'lockedTransInv', width: 80 },
      { title: '货架号', key: 'positionNo', dataIndex: 'positionNo', width: 60 },
    ];
    const paginationProps = {
      total,
      pageSize: 20,
      onChange(pageIndex) {
        p.props.dispatch({
          type: 'inventory/queryList',
          payload: {
            pageIndex,
            ...latestSearch,
          },
        });
      },
    };
    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        p.setState({ checkId: selectedRows });
      },
      selectedRowKeys: p.state.checkId.map(out => out.id),
    };
    function renderInventoryContent(key) {
      return (
        <div style={{ width: 900 }}>
          <Row>
            <Col span="7">
              <FormItem
                label="商品名称"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  size="default"
                  placeholder="请输入商品名称"
                  ref={(c) => { p.itemName = c; }}
                />
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem
                label="UPC"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  size="default"
                  placeholder="请输入UPC"
                  ref={(c) => { p.upc = c; }}
                />
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem
                label="SKU代码"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  size="default"
                  placeholder="请输入SKU代码"
                  ref={(c) => { p.skuCode = c; }}
                />
              </FormItem>
            </Col>
            <Col className="listBtnGroup" span="3" style={{ marginTop: 2 }}>
              <Button type="primary" onClick={p.doSearch.bind(p)}>查询</Button>
            </Col>
          </Row>
          <Row>
            <Button type="primary" onClick={p.handleBatchAdd.bind(p, key)} style={{ position: 'absolute', bottom: 10, left: 0 }} disabled={p.state.checkId.length === 0}>批量添加</Button>
            <Table
              columns={columns}
              dataSource={list}
              rowSelection={rowSelection}
              size="small"
              bordered
              rowKey={record => record.id}
              pagination={paginationProps}
              scroll={{ x: 1300, y: 400 }}
            />
          </Row>
        </div>
      );
    }
    const modalTableProps = {
      columns: [
        { title: <font color="#00f">商品SKU</font>,
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: '10%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_skuCode`, {
                  initialValue: t || undefined,
                  rules: [{ required: true, message: '该项必填' }],
                })(
                  <Popover
                    overlayStyle={{ width: 1000 }}
                    content={renderInventoryContent(r.key)}
                    title="搜索SKU"
                    trigger="click"
                    onVisibleChange={p.clearSelected.bind(p)}
                  >
                    <Input placeholder="请搜索" ref={(c) => { p[`r_${r.key}_skuCode`] = c; }} value={t || undefined} />
                  </Popover>,
                )}
              </FormItem>
            );
          },
        },
        { title: '货架号ID',
          dataIndex: 'inventoryAreaId',
          key: 'inventoryAreaId',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_inventoryAreaId`, {
                  initialValue: t,
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Input placeholder="请选择" />,
                )}
              </FormItem>
            );
          },
        },
        { title: 'SKU数量',
          dataIndex: 'quantity',
          key: 'quantity',
          render(t, r) {
            console.log(r);
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_quantity`, {
                  initialValue: t,
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            );
          },
        },
        { title: '商品名称', key: 'itemName', dataIndex: 'itemName', width: 200 },
        { title: '商品图片',
          key: 'skuPic',
          dataIndex: 'skuPic',
          width: 90,
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
        { title: '操作',
          key: 'oper',
          render(t, r) {
            return (
              <Popconfirm onConfirm={p.handleDeleteDetail.bind(p, r.key)} title="确定删除？">
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            );
          },
        },
      ],
      dataSource: outDetailList,
      pagination: false,
    };
    return (
      <Modal
        visible={visible}
        title="出库明细"
        width={800}
        onCancel={this.handleCancel.bind(this)}
        onOk={this.handleConfirmOut.bind(this)}
        maskClosable={false}
      >
        <Form>
          <Row>
            <Col span="12">
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
            </Col>
            <Col span="12">
              <FormItem
                label="备注"
                {...formItemLayout}
              >
                {getFieldDecorator('remark', {
                  initialValue: data.remark,
                })(
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ paddingBottom: 10 }}>
            <Col style={{ float: 'left', marginTop: 6 }}>
              <font size="3" color="#00f">出库单明细</font>
            </Col>
            <Col style={{ float: 'right', marginRight: 10 }}>
              <Button type="primary" onClick={p.addEmptyLine.bind(p)}>添加出库明细</Button>
            </Col>
          </Row>
          <Table {...modalTableProps} rowKey={r => r.key} />
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps({ inventory }) {
  const { wareList, list, total } = inventory;
  return { wareList, list, total };
}

export default connect(mapStateToProps)(Form.create()(OutModal));