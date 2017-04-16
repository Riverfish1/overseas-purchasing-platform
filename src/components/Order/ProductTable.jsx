import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, InputNumber, Button, Form, Table, Row, Col, Popover, Popconfirm, Modal, message } from 'antd';

const FormItem = Form.Item;

let searchQueue = [];

class ProductTable extends Component {
  constructor() {
    super();
    this.state = {
      skuData: [],
      skuSearchList: {},
      total: 1,
    };
    this.skuSearchInputs = {};
  }

  componentWillReceiveProps(...args) {
    if (args[0].data && args[0].data.length > 0 && this.state.skuData.length === 0) {
      this.setState({
        skuData: args[0].data.map((el, index) => {
          el.key = index + 1;
          return el;
        }),
      });
    }
  }

  getValue(callback) {
    const p = this;
    const { form } = this.props;
    const skuList = [];
    form.validateFieldsAndScroll((err, fieldsSku) => {
      if (err) {
        return;
      }
      let count = 1;
      const keys = Object.keys(fieldsSku);
      while (Object.prototype.hasOwnProperty.call(fieldsSku, `r_${count}_skuCode`)) {
        const skuSingle = {};
        keys.forEach((key) => {
          if (key.match(`r_${count}_`)) {
            skuSingle[key.split(`r_${count}_`)[1]] = fieldsSku[key];
          }
        });
        // 补一下skuCode
        if (!skuSingle.skuCode) {
          skuSingle.skuCode = p[`r_${count}_skuCode_dom`].refs.input.value;
        }
        skuList.push(skuSingle);
        count += 1;
      }
      if (skuList.length < 1) {
        message.error('请至少填写一项商品信息');
        return;
      }
      if (callback) callback(skuList);
    });
  }

  addProduct() {
    const { skuData } = this.state;
    const skuLen = skuData.length;
    const lastId = skuLen < 1 ? 0 : skuData[skuData.length - 1].key;
    const newId = parseInt(lastId, 10) + 1;
    const newItem = {
      id: '',
      key: newId,
      skuCode: '',
      skuId: '',
      itemName: '',
      color: '',
      scale: '',
      salePrice: '',
      freight: '',
      quantity: '',
    };
    skuData.push(newItem);
    this.setState({ skuData });
  }

  handleDelete(key) {
    const newData = this.state.skuData.filter(el => el.key !== key);
    this.setState({ skuData: newData });
  }

  handleSelect(key, skuCode) {
    console.log('selected');

    const { form, skuList } = this.props;
    const { skuSearchList, skuData } = this.state;

    const source = skuSearchList[key] || skuList;

    // 先判断当前列表是否有相同的skuCode，有的话数量+1
    let isDuplicate = false;
    let quantity = 0;
    skuData.forEach((el, index) => {
      if (el.skuCode === skuCode) {
        isDuplicate = index + 1;
        quantity = el.quantity += 1;
      }
    });
    if (isDuplicate) {
      this.setState({ skuData }, () => {
        form.setFieldsValue({
          [`r_${isDuplicate}_quantity`]: quantity,
        });
      });
      Modal.info({
        title: '选择了列表已有的SKU',
        content: '已为您增加销售数量',
      });
      return;
    }

    // 否则新建一条记录
    source.forEach((value) => {
      if (value.skuCode.toString() === skuCode.toString()) {
        skuData.forEach((el) => {
          if (el.key.toString() === key.toString()) {
            el.skuCode = value.skuCode;
            el.skuId = value.skuId;
            el.itemName = value.itemName;
            el.color = value.color;
            el.scale = value.scale;
            el.freight = value.freightStr;
            el.salePrice = value.salePrice || 0;
            el.quantity = value.quantity || 1;
          }
        });
        this.setState({ skuData }, () => {
          console.log('selected value: ', value);
          form.setFieldsValue({
            [`r_${key}_skuCode`]: value.skuCode,
            [`r_${key}_skuId`]: value.id,
            [`r_${key}_itemName`]: value.itemName,
            [`r_${key}_color`]: value.color,
            [`r_${key}_scale`]: value.scale,
            [`r_${key}_freight`]: value.freightStr,
            [`r_${key}_salePrice`]: value.salePrice || 0,
            [`r_${key}_quantity`]: value.quantity || 1,
          });
        });
      }
    });
  }

  handleSearch(key, value) {
    const p = this;
    if (searchQueue.length > 0) {
      searchQueue.push(value);
      return;
    }
    this.props.dispatch({
      type: 'order/searchSku',
      payload: {
        keyword: value,
        callback(status) {
          if (status !== 'ERROR') {
            const { skuSearchList } = p.state;
            skuSearchList[key] = status.data || [];
            p.setState({ skuSearchList, total: status.totalCount });
          }
          // 搜索始终进行
          if (searchQueue.length > 0) {
            const keyword = searchQueue[searchQueue.length - 1];
            searchQueue = [];
            p.handleSearch(key, keyword);
          }
        },
      },
    });
  }

  clearValue() {
    const { form } = this.props;
    this.setState({ skuData: [], skuSearchList: {} }, () => {
      form.resetFields();
    });
  }

  render() {
    const p = this;
    const { form, skuList = [], parent, total } = p.props;
    const { skuData, skuSearchList } = p.state;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    // 注册props
    if (!parent.clearSkuValue) parent.clearSkuValue = this.clearValue.bind(this);
    if (!parent.getSkuValue) parent.getSkuValue = this.getValue.bind(this);

    function renderSkuPopover(list, key, skuTotal) {
      let skuCode = null;
      let itemName = null;

      function handleEmpty() {
        skuCode.refs.input.value = '';
        itemName.refs.input.value = '';
      }

      function doSearch() {
        p.handleSearch(key, { skuCode: skuCode.refs.input.value, itemName: itemName.refs.input.value });
      }

      function updateValue(selectedSkuCode) {
        p.handleSelect(key, selectedSkuCode);
        setTimeout(() => {
          p[`r_${key}_skuCode_dom`].refs.input.click();
        }, 0);
      }

      const paginationProps = {
        pageSize: 10,
        total: skuTotal,
        onChange(page) {
          p.props.dispatch({
            type: 'sku/querySkuList',
            payload: { pageIndex: page },
          });
        },
      };

      const columns = [
        { title: 'SKU条码', dataIndex: 'skuCode', key: 'skuCode', width: 90 },
        { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 120 },
        { title: '品牌', dataIndex: 'brand', key: 'brand', width: 90 },
        { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName', width: 90, render(text) { return text || '-'; } },
        { title: '尺寸', dataIndex: 'scale', key: 'scale', width: 60, render(text) { return text || '-'; } },
        { title: '图片',
          dataIndex: 'mainPic',
          key: 'mainPic',
          width: 60,
          render(text) { // 需要解决返回的mainPic的格式的问题
            if (text) {
              const picContent = <img src={text} role="presentation" style={{ height: 600 }} />;
              return (
                <Popover title="主图预览" content={picContent}>
                  <img src={text} role="presentation" width="60" />
                </Popover>
              );
            }
            return '-';
          },
        },
        { title: '颜色', dataIndex: 'color', key: 'color', width: 80, render(text) { return text || '-'; } },
        { title: '虚拟库存', dataIndex: 'virtualInv', key: 'virtualInv', width: 70, render(text) { return text || '-'; } },
        { title: '重量（kg）', dataIndex: 'weight', key: 'weight', width: 70, render(text) { return text || '-'; } },
        { title: '操作', dataIndex: 'oper', key: 'oper', width: 50, render(t, r) { return <a onClick={() => { updateValue(r.skuCode); }}>选择</a>; } },
      ];

      return (
        <div style={{ width: 560 }}>
          <Row gutter={20} style={{ width: 720 }}>
            <Col span="7">
              <FormItem
                label="SKU编码"
                {...formItemLayout}
              >
                <Input
                  size="default"
                  placeholder="请输入SKU编码"
                  ref={(c) => { skuCode = c; }}
                />
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                <Input
                  size="default"
                  placeholder="请输入商品名称"
                  ref={(c) => { itemName = c; }}
                />
              </FormItem>
            </Col>
            <Col className="listBtnGroup" span="7" style={{ paddingTop: 2 }}>
              <Button type="primary" onClick={doSearch}>查询</Button>
              <Button type="ghost" onClick={handleEmpty}>清空</Button>
            </Col>
          </Row>
          <Row>
            <Table
              columns={columns}
              dataSource={list}
              size="small"
              bordered
              rowKey={record => record.id}
              pagination={paginationProps}
              style={{ height: 500, overflowY: 'scroll' }}
            />
          </Row>
        </div>
      );
    }

    const modalTableProps = {
      columns: [
        {
          title: <font color="#00f">商品SKU</font>,
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: '20%',
          render(text, r) {
            const list = skuSearchList[r.key] || skuList;
            const skuTotal = skuSearchList[r.key] ? p.state.total : total;
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_skuCode`, {
                  value: text || undefined,
                  rules: [{ required: true, message: '请选择SKU' }],
                })(
                  <Popover
                    content={renderSkuPopover(list, r.key, skuTotal)}
                    title="搜索SKU"
                    trigger="click"
                  >
                    <Input placeholder="选择SKU" value={text || undefined} ref={(c) => { p[`r_${r.key}_skuCode_dom`] = c; }} />
                  </Popover>,
                )}
              </FormItem>
            );
          },
        },
        {
          title: '商品名称',
          dataIndex: 'itemName',
          key: 'itemName',
          width: '14%',
          render(text) { return text || '-'; },
        },
        {
          title: '颜色',
          dataIndex: 'color',
          key: 'color',
          width: '14%',
          render(text) { return text || '-'; },
        },
        {
          title: '尺寸',
          dataIndex: 'scale',
          key: 'scale',
          width: '14%',
          render(text) { return text || '-'; },
        },
        {
          title: <font color="#00f">销售价</font>,
          dataIndex: 'salePrice',
          key: 'salePrice',
          width: '14%',
          render(text, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_salePrice`, {
                  initialValue: text,
                })(
                  <InputNumber step={0.01} min={0} placeholder="请输入" />,
                )}
                {getFieldDecorator(`r_${r.key}_skuId`, {
                  initialValue: r.skuId || r.id,
                })(
                  <Input style={{ display: 'none' }} />,
                )}
              </FormItem>);
          },
        },
        {
          title: <font color="#00f">数量</font>,
          dataIndex: 'quantity',
          key: 'quantity',
          width: '14%',
          render(text, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_quantity`, {
                  initialValue: text,
                })(
                  <InputNumber step={1} min={1} placeholder="请输入" />,
                )}
              </FormItem>);
          },
        },
        {
          title: '操作',
          key: 'operator',
          width: 60,
          render(text, record) {
            return (<Popconfirm title="确定删除?" onConfirm={p.handleDelete.bind(p, record.key)}>
              <a href="javascript:void(0)">删除</a>
            </Popconfirm>);
          },
        },
      ],
      dataSource: skuData,
      bordered: false,
      pagination: false,
    };
    return (
      <div>
        <Row style={{ paddingBottom: 10 }}>
          <Col style={{ float: 'left' }}>
            <span>订单明细信息（<font color="#00f">蓝色列可编辑</font>）</span>
          </Col>
          <Col style={{ float: 'right' }}>
            <Button type="primary" onClick={p.addProduct.bind(p)}>添加商品</Button>
          </Col>
        </Row>
        <Table {...modalTableProps} rowKey={record => record.key} />
      </div>);
  }
}

function mapStateToProps(state) {
  const { skuList, skuTotal } = state.sku;
  return {
    skuList,
    total: skuTotal,
  };
}

export default connect(mapStateToProps)(Form.create()(ProductTable));
