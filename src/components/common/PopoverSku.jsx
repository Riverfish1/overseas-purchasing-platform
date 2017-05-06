import React, { Component } from 'react';
import { Input, Button, Form, Table, Row, Col, Popover } from 'antd';

const FormItem = Form.Item;

class PopoverSku extends Component {
  doSearch() {
    this.handleSearch(key, { skuCode: skuCode.refs.input.value, name: name.refs.input.value });
  }
  handleEmpty() {
    skuCode.refs.input.value = '';
    name.refs.input.value = '';
  }
  updateValue(selectedSkuCode) {
    console.log(key, selectedSkuCode);
    p.handleSelect(key, selectedSkuCode);
    setTimeout(() => {
      p[`r_${key}_skuCode`].refs.input.click();
    }, 0);
  }
  render() {
    const p = this;
    const { form, list, key, skuTotal } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
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
      { title: 'SKU代码', dataIndex: 'skuCode', key: 'skuCode', width: 90 },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 120 },
      { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName', width: 90, render(text) { return text || '-'; } },
      { title: '尺寸', dataIndex: 'scale', key: 'scale', width: 60, render(text) { return text || '-'; } },
      { title: '图片',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: 80,
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
      { title: '操作', dataIndex: 'oper', key: 'oper', render(t, r) { return <a onClick={() => { this.updateValue.bind(r.skuCode); }}>选择</a>; } },
    ];
    return (
      <div style={{ width: 680 }}>
        <Row gutter={20} style={{ width: 720 }}>
          <Col span="7">
            <FormItem
              label="SKU代码"
              {...formItemLayout}
            >
              {getFieldDecorator('skuCode')(
                <Input
                  size="default"
                  placeholder="请输入SKU代码"
                />,
              )}
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem
              label="商品名称"
              {...formItemLayout}
            >
              {getFieldDecorator('name')(
                <Input
                  size="default"
                  placeholder="请输入商品名称"
                />,
              )}
            </FormItem>
          </Col>
          <Col className="listBtnGroup" span="7" style={{ paddingTop: 2 }}>
            <Button type="primary" onClick={this.doSearch.bind(this)}>查询</Button>
            <Button type="ghost" onClick={this.handleEmpty.bind(this)}>清空</Button>
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
            scroll={{ y: 500 }}
          />
        </Row>
      </div>
    );
  }
}

export default Form.create()(PopoverSku);
