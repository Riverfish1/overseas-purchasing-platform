import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Input, InputNumber, Select, Button, Form, Table, Row, Col, Popconfirm, message } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

let searchQueue = [];

class ProductTable extends Component {
  constructor() {
    super();
    this.state = {
      skuData: [],
      skuSearchList: {},
    };
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
    const { skuSearchList } = this.state;

    const source = skuSearchList[key] || skuList;

    source.forEach((value) => {
      if (value.skuCode.toString() === skuCode.toString()) {
        form.setFieldsValue({
          [`r_${key}_skuCode`]: value.skuCode,
          [`r_${key}_skuId`]: value.id,
          [`r_${key}_salePrice`]: value.salePrice || 0,
          [`r_${key}_quantity`]: value.quantity || 0,
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
            p.setState({ skuSearchList });
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
    const { form, skuList = [], parent } = p.props;
    const { skuData, skuSearchList } = p.state;
    const { getFieldDecorator } = form;

    // 注册props
    if (!parent.clearSkuValue) parent.clearSkuValue = this.clearValue.bind(this);
    if (!parent.getSkuValue) parent.getSkuValue = this.getValue.bind(this);

    const modalTableProps = {
      columns: [
        {
          title: <font color="#00f">商品SKU</font>,
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: '12%',
          render(text, r) {
            const list = skuSearchList[r.key] || skuList;
            console.log(skuSearchList[r.key]);
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_skuCode`, {
                  initialValue: text || undefined,
                })(
                  <Select
                    combobox
                    placeholder="请选择"
                    onSelect={p.handleSelect.bind(p, r.key)}
                    onChange={p.handleSearch.bind(p, r.key)}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                  >
                    {list.map((item, index) => {
                      return <Option key={`r_${index}`} value={item.skuCode}>{item.skuCode}</Option>;
                    })}
                  </Select>,
                )}
              </FormItem>
            );
          },
        },
        {
          title: '商品名称',
          dataIndex: 'itemName',
          key: 'itemName',
          render(text) { return text || '-'; },
        },
        {
          title: '颜色',
          dataIndex: 'color',
          key: 'color',
          width: '12%',
          render(text) { return text || '-'; },
        },
        {
          title: '尺寸',
          dataIndex: 'scale',
          key: 'scale',
          width: '12%',
          render(text) { return text || '-'; },
        },
        {
          title: <font color="#00f">销售价</font>,
          dataIndex: 'salePrice',
          key: 'salePrice',
          width: '12%',
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
          title: '运费',
          dataIndex: 'freight',
          key: 'freight',
          width: '12%',
          render(text) { return text || '-'; },
        },
        {
          title: <font color="#00f">数量</font>,
          dataIndex: 'quantity',
          key: 'quantity',
          width: '12%',
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

ProductTable.PropTypes = {
  data: PropTypes.array.isRequired,
  skuList: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { skuList } = state.sku;
  return {
    skuList: skuList.data,
  };
}

export default connect(mapStateToProps)(Form.create()(ProductTable));
