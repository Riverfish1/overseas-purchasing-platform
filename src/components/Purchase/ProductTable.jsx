import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, DatePicker, InputNumber, Modal, Select, Button, Form, Table, Row, Col, Popconfirm, Popover } from 'antd';
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
      previewImage: '',
      previewVisible: false,
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
      if (err) { return; }
      let count = 1;
      const keys = Object.keys(fieldsSku);
      while (Object.prototype.hasOwnProperty.call(fieldsSku, `r_${count}_skuCode`)) {
        const skuSingle = {};
        keys.forEach((key) => {
          // if (key === `r_${count}_taskStartTime`) fieldsSku[`r_${count}_taskStartTime`] = moment(fieldsSku[`r_${count}_taskStartTime`], 'YYYY-MM-DD');
          // if (key === `r_${count}_taskEndTime`) fieldsSku[`r_${count}_taskEndTime`] = moment(fieldsSku[`r_${count}_taskEndTime`], 'YYYY-MM-DD');
          if (key.match(`r_${count}_`)) {
            skuSingle[key.split(`r_${count}_`)[1]] = fieldsSku[key];
          }
        });
        skuSingle.taskStartTime = moment(skuSingle.taskStartTime).format('YYYY-MM-DD');
        skuSingle.taskEndTime = moment(skuSingle.taskEndTime).format('YYYY-MM-DD');
        if (!skuSingle.id) delete skuSingle.id;
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
    const { skuSearchList, skuData } = this.state;

    const source = skuSearchList[key] || skuList;

    source.forEach((value) => {
      if (value.skuCode.toString() === skuCode.toString()) {
        skuData.forEach((el) => {
          if (el.key.toString() === key.toString()) {
            el.skuId = value.id;
            el.skuCode = value.skuCode;
          }
        });
        this.setState({ skuData }, () => {
          form.setFieldsValue({
            [`r_${key}_skuId`]: value.id,
            [`r_${key}_skuCode`]: value.skuCode,
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
    const { form, skuList = [], parent, buyer = [], total } = p.props;
    const { skuData, skuSearchList, previewImage, previewVisible } = p.state;
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
      let name = null;

      function handleEmpty() {
        skuCode.refs.input.value = '';
        name.refs.input.value = '';
      }

      function doSearch() {
        p.handleSearch(key, { skuCode: skuCode.refs.input.value, name: name.refs.input.value });
      }

      function updateValue(selectedSkuCode) {
        console.log(key, selectedSkuCode);
        p.handleSelect(key, selectedSkuCode);
        setTimeout(() => {
          p[`r_${key}_skuCode`].refs.input.click();
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
        { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName', width: 90, render(text) { return text || '-'; } },
        { title: '尺寸', dataIndex: 'scale', key: 'scale', width: 60, render(text) { return text || '-'; } },
        { title: '图片',
          dataIndex: 'skuPic',
          key: 'skuPic',
          width: 60,
          render(text) { // 需要解决返回的skuPic的格式的问题
            let imgUrl = '';
            try {
              const imgObj = JSON.parse(text);
              imgUrl = imgObj.picList[0].url;
              const picContent = <img src={imgUrl} role="presentation" style={{ height: 600 }} />;
              return (
                <Popover title="主图预览" content={picContent}>
                  <img src={imgUrl} role="presentation" width="60" />
                </Popover>
              );
            } catch (e) {
              return '-';
            }
          },
        },
        { title: '颜色', dataIndex: 'color', key: 'color', width: 80, render(text) { return text || '-'; } },
        { title: '虚拟库存', dataIndex: 'virtualInv', key: 'virtualInv', width: 70, render(text) { return text || '-'; } },
        { title: '操作', dataIndex: 'oper', key: 'oper', render(t, r) { return <a onClick={() => { updateValue(r.skuCode); }}>选择</a>; } },
      ];

      return (
        <div style={{ width: 680 }}>
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
          width: '10%',
          render(t, r) {
            const list = skuSearchList[r.key] || skuList;
            const skuTotal = skuSearchList[r.key] ? p.state.total : total;
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_skuCode`, {
                  initialValue: t || undefined,
                  rules: [{ required: true, message: '该项必填' }],
                })(
                  <Popover
                    content={renderSkuPopover(list, r.key, skuTotal)}
                    title="搜索SKU"
                    trigger="click"
                  >
                    <Input placeholder="请搜索" ref={(c) => { p[`r_${r.key}_skuCode`] = c; }} value={t || undefined} />
                  </Popover>,
                )}
              </FormItem>
            );
          },
        },
        {
          title: <font color="#00f">买手</font>,
          dataIndex: 'buyerId',
          key: 'buyerId',
          width: '8.5%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_buyerId`, {
                  initialValue: t ? t.toString() : undefined,
                  rules: [{ required: true, message: '该项必选' }],
                })(
                  <Select placeholder="请选择" optionLabelProp="title">
                    {buyer.map(el => <Option key={el.id} title={el.name}>{el.name}</Option>)}
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
                  rules: [{ required: true, message: '该项必填' }],
                })(
                  <InputNumber step={0.01} placeholder="请输入" />,
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
                  rules: [{ required: true, message: '该项必填' }],
                })(
                  <InputNumber step={0.01} placeholder="请输入" />,
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
                  initialValue: typeof t !== 'undefined' ? t.toString() : '1',
                  rules: [{ required: true, message: '该项必填' }],
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
                  rules: [{ required: true, message: '该项必填' }],
                })(
                  <InputNumber step={1} min={1} placeholder="请输入" />,
                )}
              </FormItem>);
          },
        },
        {
          title: <font color="#00f">参考最大采购数量</font>,
          dataIndex: 'taskMaxCount',
          key: 'taskMaxCount',
          width: '8.5%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_taskMaxCount`, {
                  initialValue: t || undefined,
                  rules: [{ required: true, message: '该项必填' }],
                })(
                  <InputNumber placeholder="请输入" />,
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
                  initialValue: t ? moment(t, 'YYYY-MM-DD') : moment(new Date(), 'YYYY-MM-DD'),
                  rules: [{ required: true, message: '该项必填' }],
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
                  rules: [{ required: true, message: '该项必填' }],
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
                  initialValue: t || '0',
                  rules: [{ required: true, message: '该项必选' }],
                })(
                  <Select>
                    <Option value="0">买手采购</Option>
                    <Option value="1">仓库调货</Option>
                  </Select>,
                )}
                {getFieldDecorator(`r_${r.key}_skuId`, {
                  initialValue: r.skuId || undefined,
                })(
                  <Input placeholder="请搜索" ref={(c) => { p[`r_${r.key}_skuId`] = c; }} style={{ display: 'none' }} />,
                )}
                {getFieldDecorator(`r_${r.key}_id`, {
                  initialValue: r.id,
                })(
                  <Input placeholder="请搜索" ref={(c) => { p[`r_${r.key}_id`] = c; }} style={{ display: 'none' }} />,
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
          <Col span={20}>
            <span>采购明细信息（<font color="#00f">蓝色列可编辑</font>）</span>
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={p.addProduct.bind(p)}>添加商品</Button>
          </Col>
        </Row>
        <Table {...modalTableProps} rowKey={record => record.key} />
        <Modal visible={previewVisible} title="预览图片" footer={null} onCancel={this.handleCancel.bind(this)}>
          <img role="presentation" style={{ width: '100%' }} src={previewImage} />
        </Modal>
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
