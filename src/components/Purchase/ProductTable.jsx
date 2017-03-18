import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Input, DatePicker, InputNumber, Select, Button, Form, Table, Row, Col, Popconfirm, Popover } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

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
    const { form, skuList = [], parent, buyer = [] } = p.props;
    const { skuData, skuSearchList } = p.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    // 注册props
    if (!parent.clearSkuValue) parent.clearSkuValue = this.clearValue.bind(this);
    if (!parent.getSkuValue) parent.getSkuValue = this.getValue.bind(this);

    function renderSkuPopover(list, key) {
      let skuCode = null;
      let name = null;

      function handleEmpty() {
        skuCode.refs.input.value = '';
        name.refs.input.value = '';
      }

      function doSearch() {
        p.handleSearch(key, { skuCode: skuCode.refs.input.value, name: name.refs.input.value });
      }

      function updateValue(selectedSkuCode) {
        p.handleSelect(key, selectedSkuCode);
        setTimeout(() => {
          p[`r_${key}_skuId`].refs.input.click();
        }, 0);
      }

      const columns = [
        { title: 'SKU条码', dataIndex: 'skuCode', key: 'skuCode', width: 90 },
        { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 120 },
        { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName', width: 90, render(text) { return text || '-'; } },
        { title: '尺寸', dataIndex: 'scale', key: 'scale', width: 60, render(text) { return text || '-'; } },
        { title: '颜色', dataIndex: 'color', key: 'color', width: 80, render(text) { return text || '-'; } },
        { title: '虚拟库存', dataIndex: 'virtualInv', key: 'virtualInv', width: 70, render(text) { return text || '-'; } },
        { title: '操作', dataIndex: 'oper', key: 'oper', render(t, r) { return <a onClick={() => { updateValue(r.skuCode); }}>选择</a>; } },
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
                  ref={(c) => { name = c; }}
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
              pagination={false}
            />
          </Row>
        </div>
      );
    }

    const modalTableProps = {
      columns: [
        {
          title: <font color="#00f">商品SKU</font>,
          dataIndex: 'skuId',
          key: 'skuId',
          width: '8.5%',
          render(t, r) {
            const list = skuSearchList[r.key] || skuList;
            console.log(skuSearchList[r.key]);
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_skuId`, {
                  initialValue: t || undefined,
                })(
                  <Popover
                    content={renderSkuPopover(list, r.key)}
                    title="搜索SKU"
                    trigger="click"
                  >
                    <Input placeholder="请搜索" ref={(c) => { p[`r_${r.key}_skuId`] = c; }} value={t || undefined} />
                  </Popover>,
                )}
              </FormItem>
            );
          },
        },
        {
          title: <font color="#00f">买手</font>,
          dataIndex: 'userId',
          key: 'userId',
          width: '8.5%',
          render(t, r) {
            return (<FormItem>
              {getFieldDecorator(`r_${r.key}_userId`, {
                initialValue: t || undefined,
              })(
                <Select placeholder="请选择">
                  {buyer.map(el => <Option key={el.id}>{el.name}</Option>)}
                </Select>,
              )}
            </FormItem>);
          },
        },
        {
          title: <font color="#00f">币种</font>,
          dataIndex: 'currency',
          key: 'currency',
          width: '8.5%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_currency`, {
                  initialValue: t || undefined,
                })(
                  <Select placeholder="请选择" >
                    <Option value="1">人民币</Option>
                    <Option value="2">美元</Option>
                  </Select>,
                )}
              </FormItem>
            );
          },
        },
        {
          title: <font color="#00f">参考采购价</font>,
          dataIndex: 'taskPrice',
          key: 'taskPrice',
          width: '8.5%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_taskPrice`, {
                  initialValue: t || undefined,
                })(
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            );
          },
        },
        {
          title: <font color="#00f">参考最大采购价</font>,
          dataIndex: 'taskMaxPrice',
          key: 'taskMaxPrice',
          width: '8.5%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_taskMaxPrice`, {
                  initialValue: t || undefined,
                })(
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            );
          },
        },
        {
          title: <font color="#00f">采购方式</font>,
          dataIndex: 'mode',
          key: 'mode',
          width: '8.5%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_mode`, {
                  initialValue: t || undefined,
                })(
                  <Select placeholder="请选择" >
                    <Option value="0">线上</Option>
                    <Option value="1">线下</Option>
                  </Select>,
                )}
              </FormItem>
            );
          },
        },
        {
          title: <font color="#00f">采购数量</font>,
          dataIndex: 'count',
          key: 'count',
          width: '8.5%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_count`, {
                  initialValue: t,
                })(
                  <InputNumber step={1} min={1} placeholder="请输入" />,
                )}
              </FormItem>);
          },
        },
        {
          title: <font color="#00f">尺寸</font>,
          dataIndex: 'scale',
          key: 'scale',
          width: '8.5%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_scale`, {
                  initialValue: t,
                })(
                  <InputNumber step={1} min={1} placeholder="请输入" />,
                )}
              </FormItem>
            );
          },
        },
        {
          title: <font color="#00f">任务开始时间</font>,
          dataIndex: 'taskStartTime',
          key: 'taskStartTime',
          width: '10%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_taskStartTime`, {
                  initialValue: t ? moment(t, 'YYYY-MM-DD') : undefined,
                })(
                  <DatePicker />,
                )}
              </FormItem>
            );
          },
        },
        {
          title: <font color="#00f">任务结束时间</font>,
          dataIndex: 'taskEndTime',
          key: 'taskEndTime',
          width: '10%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_taskEndTime`, {
                  initialValue: t ? moment(t, 'YYYY-MM-DD') : undefined,
                })(
                  <DatePicker />,
                )}
              </FormItem>
            );
          },
        },
        {
          title: <font color="#00f">说明</font>,
          dataIndex: 'remark',
          key: 'remark',
          width: '8.5%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_remark`, {
                  initialValue: t || undefined,
                })(
                  <Input placeholder="请输入" />,
                )}
              </FormItem>
            );
          },
        },
        {
          title: '操作',
          key: 'operator',
          render(t, record) {
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
