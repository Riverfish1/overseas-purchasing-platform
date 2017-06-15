import React, { Component } from 'react';
import { Input, Button, Popover, InputNumber } from 'antd';

export default class extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      visible: false,
      quantity: 1,
      positionNo: undefined,
      showError: false,
    };
  }
  toggleVisible() {
    this.setState({ visible: !this.state.visible, quantity: 1, positionNo: undefined, showError: false });
  }
  submit() {
    const { record } = this.props;
    const { quantity, positionNo } = this.state;
    if (!quantity || !positionNo) {
      this.setState({ showError: true });
      return;
    }
    this.toggleVisible();
    this.props.dispatch({
      type: 'inventory/checkIn',
      payload: { quantity, positionNo, skuId: record.skuId, warehouseId: record.warehouseId },
    });
  }
  render() {
    const { showError } = this.state;
    const { record } = this.props;
    return (
      <Popover
        content={<div>
          <div>商品名称：{record.itemName}</div>
          <div style={{ paddingTop: 6 }}>盘入数量：<InputNumber placeholder="请输入" step={1} value={this.state.quantity} onChange={v => this.setState({ quantity: v })} /></div>
          <div style={{ paddingTop: 6 }}>{`盘入货架号：${record.positionNo}`}</div>
          {showError && <div style={{ paddingTop: 6, color: 'red' }}>请填写盘入数量与盘入货架号</div>}
          <Button size="small" type="primary" style={{ marginTop: 6 }} onClick={this.submit.bind(this)}>保存</Button>
        </div>}
        title="库存盘进"
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.toggleVisible.bind(this)}
      >
        <a href="javascript:void(0)" style={{ marginRight: 10 }}>库存盘进</a>
      </Popover>
    );
  }
}
