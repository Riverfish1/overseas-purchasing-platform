import React, { Component } from 'react';
import { Row, Table, Popconfirm } from 'antd';

class SkuTable extends Component {
  componentWillReceiveProps(...args) {
    console.log(args);
  }
  render() {
    const p = this;
    const modalTableProps = {
      columns: [
        {
          title: '序号',
          key: 'order',
          width: '6%',
        },
        {
          title: '尺寸',
          dataIndex: 'scale',
          key: 'scale',
          width: '14%',
        },
        {
          title: '颜色',
          dataIndex: 'color',
          key: 'color',
          width: '14%',
        },
        {
          title: '库存',
          dataIndex: 'inventory',
          key: 'inventory',
          width: '14%',
        },
        {
          title: '虚拟库存',
          dataIndex: 'virtualInventory',
          key: 'virtualInventory',
          width: '14%',
        },
        {
          title: 'barcode',
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: '14%',
        },
        {
          title: '重量(KG)',
          dataIndex: 'weight',
          key: 'weight',
          width: '14%',
        },
        {
          title: '操作',
          key: 'operator',
          render(text, record) {
            return (
              <Popconfirm title="确定删除?" onConfirm={p.handleDelete(record.id)}>
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            );
          },
        },
      ],
      dataSource: [],
      bordered: false,
    };

    return (
      <Row>
        <Table
          {...modalTableProps}
          rowKey={record => record.id}
        />
      </Row>
    );
  }
}

export default SkuTable;
