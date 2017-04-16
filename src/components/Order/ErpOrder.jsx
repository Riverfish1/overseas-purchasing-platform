import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table, Popover } from 'antd';

import styles from './Order.less';

class ErpOrder extends Component {
  render() {
    const p = this;
    const { erpOrderList } = p.props;
    const orderStatusContent = (
      <div className={styles.popoverContent}>
        <p><a href="javascript:void(0)">取消订单</a></p>
        <p><a href="javascript:void(0)">支付确认</a></p>
        <p><a href="javascript:void(0)">完成确认</a></p>
        <p><a href="javascript:void(0)">重新分配库存</a></p>
        <p><a href="javascript:void(0)">所有订单重新分配库存</a></p>
        <p><a href="javascript:void(0)">清除分配数据</a></p>
        <p><a href="javascript:void(0)">拆分订单</a></p>
      </div>
    );
    const columns = [
      { title: 'erp订单号', dataIndex: 'erpNo', key: 'erpNo', width: '12%' },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: '12%' },
      { title: '外部订单号', dataIndex: 'outerNo', key: 'outerNo', width: '10%', render(text) { return text || '-'; } },
      { title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        width: '6%',
        render(text) {
          switch (text) {
            case 0: return '待支付';
            case 1: return '待审核';
            case 2: return '备货中';
            case 3: return '部分发货';
            case 4: return '已发货';
            case 5: return '已完成';
            case 6: return '已取消';
            default: return '-';
          }
        },
      },
      {
        title: '备货状态',
        dataIndex: 'stockupStatus',
        key: 'stockupStatus',
        width: '6%',
        render(text) {
          switch (text) {
            case 0: return '未备货';
            case 1: return '部分备货';
            case 2: return '部分在途备货';
            case 3: return '全部在途备货';
            case 10: return '已备货';
            default: return '-';
          }
        },
      },
      { title: '收件人', dataIndex: 'receiver', key: 'receiver', width: '6%' },
      { title: '收件人地址',
        dataIndex: 'address',
        key: 'address',
        width: '10%',
        render(text, record) {
          return <span>{text ? `${text} ${record.addressDetail}` : '-'}</span>;
        },
      },
      { title: '联系电话', dataIndex: 'telephone', key: 'telephone', width: '8%' },
      { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: '12%' },
      { title: '备注', dataIndex: 'remarks', key: 'remarks', width: '10%', render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 200,
        render() {
          return (
            <div>
              {/* <a href="javascript:void(0)" onClick={p.handleProDetail.bind(p, record)}>查看SKU</a>
              <a href="javascript:void(0)" style={{ margin: '0 10px' }} onClick={p.updateModal.bind(p, record.id)}>修改</a>
              <Popconfirm title="确定删除此订单？" onConfirm={p.handleDelete.bind(p, record.id)}>
                <a href="javascript:void(0)" style={{ marginRight: '10px' }}>删除</a>
              </Popconfirm>*/}
              <Popover title={null} content={orderStatusContent}>
                <a href="javascript:void(0)" >状态操作</a>
              </Popover>
            </div>);
        },
      },
    ];
    return (
      <div>
        <Table columns={columns} dataSource={erpOrderList} rowKey={r => r.id} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { erpOrderList } = state.order;
  return { erpOrderList };
}

export default connect(mapStateToProps)(Form.create()(ErpOrder));
