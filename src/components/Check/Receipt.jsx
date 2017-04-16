import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

class Receipt extends Component {
  handlePreStock(r) {
    console.log(r);
  }
  render() {
    const p = this;
    const { receiptList = [] } = this.props;
    const columns = [
      { title: '小票单号', dataIndex: 'receiptNo', key: 'receiptNo' },
      { title: '总价', dataIndex: 'totalPrice', key: 'totalPrice' },
      { title: '操作',
        key: 'oper',
        render(t, r) {
          return <a onClick={p.handlePreStock.bind(p, r)}>小票确认预入库</a>;
        },
      },
    ];
    return (
      <div>
        <Table columns={columns} dataSource={receiptList} pagination={false} rowKey={record => record.id} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { receiptList } = state.check;
  return { receiptList };
}

export default connect(mapStateToProps)(Receipt);
