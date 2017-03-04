import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Input, Select, Button, Form, Table, Row, Col, Popconfirm } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class ProductTable extends Component {
  constructor() {
    super();
    this.state = {
      skuData: [],
    };
  }

  componentWillReceiveProps(...args) {
    if (args[0].data && args[0].data.length > 0 && this.state.skuData.length === 0) {
      this.props.dispatch({
        type: 'sku/querySkuList',
        payload: {},
      });
      this.setState({
        skuData: args[0].data,
      });
    }
  }

  addProduct() {
    const { skuData } = this.state;
    const skuLen = skuData.length;
    const lastId = skuLen < 1 ? 0 : skuData[skuData.length - 1].key;
    const newId = parseInt(lastId, 10) + 1;
    const newItem = {
      id: newId,
      skuCode: '',
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

  handleDelete(id) {

  }

  handleSelect(value) {
    console.log(value);
    const { form } = this.props;
    form.setFieldsValue({
      skuCode: value.skuCode,
      salePrice: value.salePrice,
      quantity: value.quantity,
    });
  }

  render() {
    const p = this;
    const { form, skuList = [] } = p.props;
    const { skuData } = p.state;
    const { getFieldDecorator } = form;
    const modalTableProps = {
      columns: [
        {
          title: <font color="#00f">商品SKU</font>,
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: '12%',
          render(text, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.id}_skuCode`, {
                  initialValue: text,
                })(
                  <Select placeholder="请选择" onSelect={p.handleSelect.bind(p, r)} >
                    {skuList.map((item) => {
                      return <Option key={`r_${r.id}_skuCode`} value={item.skuCode}>{item.skuCode}</Option>;
                    })}
                  </Select>,
                )}
              </FormItem>);
          },
        },
        {
          title: '商品名称',
          dataIndex: 'itemName',
          key: 'itemName',
          width: '12%',
        },
        {
          title: '颜色',
          dataIndex: 'color',
          key: 'color',
          width: '12%',
        },
        {
          title: '尺寸',
          dataIndex: 'scale',
          key: 'scale',
          width: '12%',
        },
        {
          title: <font color="#00f">销售价</font>,
          dataIndex: 'salePrice',
          key: 'salePrice',
          width: '12%',
          render(text, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.id}_salePrice`, {
                  initialValue: text,
                })(
                  <Input />,
                )}
              </FormItem>);
          },
        },
        {
          title: '运费',
          dataIndex: 'freight',
          key: 'freight',
          width: '12%',
        },
        {
          title: <font color="#00f">数量</font>,
          dataIndex: 'quantity',
          key: 'quantity',
          render(text, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.id}_quantity`, {
                  initialValue: text,
                })(
                  <Input />,
                )}
              </FormItem>);
          },
        },
        {
          title: '操作',
          key: 'operator',
          render(text, record) {
            return (<Popconfirm title="确定删除?" onConfirm={p.handleDelete.bind(p, record.id)}>
              <a href="javascript:void(0)">删除</a>
            </Popconfirm>);
          },
        },
      ],
      dataSource: skuData,
      bordered: false,
      pagination: true,
    };
    return (
      <div>
        <Row>
          <Col style={{ float: 'left', marginLeft: 20 }}>
            <span>订单明细信息（<font color="#00f">蓝色列可编辑</font>）</span>
          </Col>
          <Col style={{ float: 'right', marginRight: 20 }}>
            <Button type="primary" onClick={p.addProduct.bind(p)}>添加商品</Button>
          </Col>
        </Row>
        <Table {...modalTableProps} rowKey={record => record.id} />
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
