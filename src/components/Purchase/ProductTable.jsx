import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Input, InputNumber, Select, Button, Form, Table, Row, Col, Popconfirm } from 'antd';

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
      // if (skuList.length < 1) {
      //   message.error('请至少填写一项商品信息');
      //   return;
      // }
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
          width: '8.5%',
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
          title: '买手',
          dataIndex: 'userId',
          key: 'userId',
          width: '8.5%',
          render(text) { return text || '-'; },
        },
        {
          title: '币种',
          dataIndex: 'currency',
          key: 'currency',
          width: '8.5%',
          render(text) { return text || '-'; },
        },
        {
          title: '参考采购价',
          dataIndex: 'taskPrice',
          key: 'taskPrice',
          width: '8.5%',
          render(text) { return text || '-'; },
        },
        {
          title: '参考最大采购价',
          dataIndex: 'taskMaxPrice',
          key: 'taskMaxPrice',
          width: '8.5%',
          render(text) { return text || '-'; },
        },
        {
          title: '采购方式',
          dataIndex: 'mode',
          key: 'mode',
          width: '8.5%',
          render(text) { return text || '-'; },
        },
        {
          title: <font color="#00f">采购数量</font>,
          dataIndex: 'count',
          key: 'count',
          width: '8.5%',
          render(text, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_count`, {
                  initialValue: text,
                })(
                  <InputNumber step={1} min={1} placeholder="请输入" />,
                )}
              </FormItem>);
          },
        },
        {
          title: '尺寸',
          dataIndex: 'scale',
          key: 'scale',
          width: '8.5%',
          render(text) { return text || '-'; },
        },
        {
          title: '任务开始时间',
          dataIndex: 'taskStartTime',
          key: 'taskStartTime',
          width: '8.5%',
          render(text) { return text || '-'; },
        },
        {
          title: '任务结束时间',
          dataIndex: 'taskEndTime',
          key: 'taskEndTime',
          width: '8.5%',
          render(text) { return text || '-'; },
        },
        {
          title: '说明',
          dataIndex: 'remark',
          key: 'remark',
          width: '8.5%',
          render(text) { return text || '-'; },
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
            <span>采购明细信息（<font color="#00f">蓝色列可编辑</font>）</span>
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
