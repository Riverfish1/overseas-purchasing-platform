import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input, Popover, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

@window.regStateCache
class Inout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
    };
  }

  handleSubmit(e, page) {
    if (e) e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      this.props.dispatch({
        type: 'inventory/queryInoutList',
        payload: { ...fieldsValue, pageIndex: typeof page === 'number' ? page : 1 },
      });
    });
  }

  handleEmpty() {
    const { resetFields } = this.props.form;
    resetFields();
  }

  handleBigPic(value) {
    this.setState({
      previewImage: value,
    });
  }

  render() {
    const p = this;
    const { inoutTotal, inoutList = [], form, wareList = [] } = this.props;
    const { previewImage } = this.state;
    const { getFieldDecorator } = form;

    const content = (
      <img role="presentation" src={previewImage} style={{ width: 400 }} />
    );
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 100 },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 200 },
      { title: 'UPC', dataIndex: 'upc', key: 'upc', width: 100 },
      { title: 'SKU图片',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: 100,
        render(text) {
          let imgUrl = '';
          if (text) {
            const imgObj = JSON.parse(text);
            imgUrl = imgObj.picList[0].url;
            console.log(imgUrl);
            return (
              <Popover title={null} content={content}>
                <img role="presentation" onMouseEnter={p.handleBigPic.bind(p, imgUrl)} src={imgUrl} width="50" height="50" />
              </Popover>
            );
          }
          return '-';
        },
      },
      { title: '仓库名称', dataIndex: 'warehouseName', key: 'warehouseName', width: 80, render(text) { return text || '-'; } },
      { title: '货位号', dataIndex: 'positionNo', key: 'positionNo', width: 50, render(text) { return text || '-'; } },
      { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 50, render(text) { return text || '-'; } },
      { title: '操作类型',
        dataIndex: 'operatorType',
        key: 'operatorType',
        width: 60,
        render(text) {
          switch (text) {
            case 0: return '采购入库';
            case 1: return '销售出库';
            case 2: return '在途入库';
            case 3: return '库存盘出';
            case 4: return '库存盘入';
            default: return '-';
          }
        },
      },
    ];

    const paginationProps = {
      total: inoutTotal,
      pageSize: 20,
      onChange(pageIndex) {
        p.handleSubmit(null, pageIndex);
      },
    };

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="仓库"
                {...formItemLayout}
              >
                {getFieldDecorator('warehouseId', {})(
                  <Select placeholder="请选择仓库" optionLabelProp="title" combobox>
                    {wareList.map(el => <Option key={el.id} title={el.name}>{el.name}</Option>)}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="SKU代码"
                {...formItemLayout}
              >
                {getFieldDecorator('skuCode', {})(
                  <Input placeholder="请输入SKU代码" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="UPC"
                {...formItemLayout}
              >
                {getFieldDecorator('upc', {})(
                  <Input placeholder="请输入upc" />)}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('itemName', {})(
                  <Input placeholder="请输入商品名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="操作类型"
                {...formItemLayout}
              >
                {getFieldDecorator('operatorType', {})(
                  <Select placeholder="请选择操作类型">
                    <Option value={0}>采购入库</Option>
                    <Option value={1}>销售出库</Option>
                    <Option value={2}>在途入库</Option>
                    <Option value={3}>库存盘出</Option>
                    <Option value={4}>库存盘入</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginLeft: 13 }}>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={this.handleEmpty.bind(this)}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col className="operBtn" style={{ paddingTop: 0, paddingBottom: 5, border: 'none' }}>
            {/* <Button type="primary" size="large" onClick={this.showModal.bind(this)}>添加</Button> */}
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={inoutList}
              bordered
              rowKey={record => record.id}
              pagination={paginationProps}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { inoutList, inoutTotal, wareList } = state.inventory;
  return {
    inoutList,
    inoutTotal,
    wareList,
  };
}

export default connect(mapStateToProps)(Form.create()(Inout));
