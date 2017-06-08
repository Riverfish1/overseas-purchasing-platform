import React, { Component } from 'react';
import { Input, Button, Popover, InputNumber } from 'antd';

export default class extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      visible: false,
      toTrans: 1,
      positionNo: undefined,
      showError: false,
    };
  }
  toggleVisible() {
    this.setState({ visible: !this.state.visible, toTrans: 1, positionNo: undefined, showError: false });
  }
  submit() {
    const { record } = this.props;
    const { toTrans, positionNo } = this.state;
    if (!toTrans || !positionNo) {
      this.setState({ showError: true });
      return;
    }
    this.toggleVisible();
    this.props.dispatch({
      type: 'inventory/transTo',
      payload: { toTrans, positionNo, inventoryAreaId: record.id },
    });
  }
  render() {
    const { showError } = this.state;
    const { record } = this.props;
    return (
      <Popover
        content={<div>
          <div>商品名称：{record.itemName}</div>
          <div style={{ paddingTop: 6 }}>入仓数量：<InputNumber placeholder="请输入" step={1} value={this.state.toTrans} onChange={v => this.setState({ toTrans: v })} /></div>
          <div style={{ paddingTop: 6 }}>货架编号：<Input style={{ width: 160, display: 'inline-block' }} placeholder="请输入" value={this.state.positionNo} onChange={e => this.setState({ positionNo: e.target.value.toUpperCase() })} /></div>
          {showError && <div style={{ paddingTop: 6, color: 'red' }}>请填写入仓数量与货架号</div>}
          <Button size="small" type="primary" style={{ marginTop: 6 }} onClick={this.submit.bind(this)}>保存</Button>
        </div>}
        title="在途入仓"
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.toggleVisible.bind(this)}
      >
        <a href="javascript:void(0)" style={{ marginRight: 10 }}>在途入仓</a>
      </Popover>
    );
  }
}
