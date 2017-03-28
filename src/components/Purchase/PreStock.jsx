import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table } from 'antd';

class PreStock extends Component {
  render() {
    const { list = [] } = this.props;
    const columns = [
      { title: '任务单号', dataIndex: 'taskOrderNo', key: 'taskOrderNo' },
    ];
    return (
      <div>
        <Table columns={columns} dataSource={list} pagination={false} rowKey={record => record.id} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list } = state.purchase;
  return { list };
}

export default connect(mapStateToProps)(Form.create()(PreStock));
