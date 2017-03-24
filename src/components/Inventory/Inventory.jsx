import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table } from 'antd';

class Inventory extends Component {
  render() {
    const { list = [], total } = this.props;
    const columns = [
      { title: '商品sku', key: 'skuCode', dataIndex: 'skuCode' },
      { title: '商品名称', key: 'itemName', dataIndex: 'itemName' },
      { title: '商品图片', key: 'skuPic', dataIndex: 'skuPic' },
      { title: '仓库名称', key: 'warehouseName', dataIndex: 'warehouseName' },
      { title: 'upc', key: 'upc', dataIndex: 'upc' },
      { title: '包裹号', key: 'positionNo', dataIndex: 'positionNo' },
      { title: '在途库存', key: 'inventory', dataIndex: 'inventory' },
      { title: '转换库存', key: 'transInv', dataIndex: 'transInv' },
      { title: '实际库存', key: 'availableInv', dataIndex: 'availableInv' },
      { title: '占用数量', key: 'lockedInv', dataIndex: 'lockedInv' },
    ];
    const paginationProps = {
      total,
      pageSize: 10,
    };
    return (
      <div>
        <Table dataSource={list} columns={columns} pagination={paginationProps} rowKey={record => record.id} />
      </div>);
  }
}

function mapStateToProps(state) {
  const { list, total } = state.inventory;
  return { list, total };
}

export default connect(mapStateToProps)(Form.create()(Inventory));
