import React, { Component } from 'react';
import { Form, Input, Modal, Row, Col, Alert, Table, Cascader, Select, Popover } from 'antd';

import divisions from '../../../utils/divisions.json';
import check from '../../../utils/checkLib';

const FormItem = Form.Item;
const Option = Select.Option;

class DeliveryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkId: [],
    };
  }
  componentWillReceiveProps({ checkId }) {
    if (checkId) {
      this.setState({ checkId });
    }
  }
  handleSubmit() {
    const p = this;
    const { form, dispatch } = this.props;
    const { checkId } = this.state;
    form.validateFields((err, values) => {
      if (err) return;
      if (values.address) {
        values.receiverState = values.address[0];
        values.receiverCity = values.address[1];
        values.receiverDistrict = values.address[2];
        delete values.address;
      }
      values.erpOrderId = JSON.stringify(checkId);
      dispatch({
        type: 'order/multiDelivery',
        payload: { ...values },
        callback() {
          p.handleCancel();
        },
      });
    });
  }
  handleCancel() {
    const { form, closeModal } = this.props;
    form.resetFields();
    closeModal();
  }
  checkPhone(rules, value, cb) {
    if (value && !check.phone(value)) cb('请输入正确的手机号码');
    cb();
  }
  checkIdCard(rules, value, cb) {
    if (!value) cb();
    else if (check.idcard(value)) cb();
    else cb(new Error('请填写正确的身份证号'));
  }
  render() {
    const p = this;
    const { visible, form, data, deliveryCompanyList } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    const columns = [
      { title: '子订单号', dataIndex: 'erpNo', key: 'erpNo', width: 100 },
      { title: 'SKU编号', dataIndex: 'skuCode', key: 'skuCode', width: 200 },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName', width: 150 },
      { title: '商品图片',
        dataIndex: 'skuPic',
        key: 'skuPic',
        width: 100,
        render(t) {
          if (t) {
            const picObj = JSON.parse(t);
            const picList = picObj.picList;
            if (picList.length) {
              const imgUrl = picList[0].url;
              return (
                <Popover title={null} content={<img role="presentation" src={imgUrl} style={{ width: 400 }} />}>
                  <img role="presentation" src={imgUrl} width={60} height={60} />
                </Popover>
              );
            }
          }
          return '-';
        },
      },
      { title: '物流方式',
        dataIndex: 'logisticType',
        key: 'logisticType',
        width: 60,
        render(t) {
          switch (t) {
            case 0: return '直邮';
            case 1: return '拼邮';
            default: return '-';
          }
        },
      },
      { title: '颜色', dataIndex: 'color', key: 'color', width: 100 },
      { title: '尺码', dataIndex: 'scale', key: 'scale', width: 100 },
      { title: '购买数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
      { title: '发货仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
    ];
    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        const listId = [];
        selectedRows.forEach((el) => {
          listId.push(el.id);
        });
        p.setState({ checkId: listId });
      },
      selectedRowKeys: p.state.checkId,
      getCheckboxProps: r => ({
        defaultChecked: p.state.checkId.forEach(el => el === r.id),
      }),
    };

    const initialAddress = [];
    initialAddress.push(data.receiverState);
    initialAddress.push(data.receiverCity);
    initialAddress.push(data.receiverDistrict);

    return (
      <div>
        <Modal
          visible={visible}
          title="批量发货"
          onOk={p.handleSubmit.bind(p)}
          onCancel={p.handleCancel.bind(p)}
          width={900}
        >
          <Form>
            {data.info && <Row>
              <Alert
                message={data.info}
                type="error"
                closable
              />
              <div style={{ height: 10 }} />
            </Row>}
            <Row>
              <Col span={12}>
                <FormItem
                  label="收件人"
                  {...formItemLayout}
                >
                  {getFieldDecorator('receiver', {
                    initialValue: data.receiver,
                    rules: [{ required: true, message: '请输入收件人' }],
                  })(
                    <Input placeholder="请输入收件人" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="收件地址"
                  {...formItemLayout}
                >
                  {getFieldDecorator('address', {
                    initialValue: initialAddress,
                    rules: [{ required: true, message: '请输入收件地址' }],
                  })(
                    <Cascader options={divisions} placeholder="请选择" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="联系电话"
                  {...formItemLayout}
                >
                  {getFieldDecorator('telephone', {
                    initialValue: data.telephone,
                    rules: [{ validator: this.checkPhone.bind(this) }],
                  })(
                    <Input placeholder="请输入联系电话" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="详细地址"
                  {...formItemLayout}
                >
                  {getFieldDecorator('addressDetail', {
                    initialValue: data.addressDetail,
                    rules: [{ required: true, message: '请输入详细地址' }],
                  })(
                    <Input placeholder="请输入详细地址" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="物流运单号"
                  {...formItemLayout}
                >
                  {getFieldDecorator('logisticNo', {
                    initialValue: data.logisticNo,
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Input placeholder="请输入物流运单号" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="物流公司名称"
                  {...formItemLayout}
                >
                  {getFieldDecorator('logisticCompany', {
                    initialValue: data.logisticCompany || undefined,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择物流公司名称" >
                      {deliveryCompanyList.map(v => (
                        <Option value={v.name} key={v.name}>{v.name}</Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="运单状态"
                  {...formItemLayout}
                >
                  {getFieldDecorator('status', {
                    initialValue: data.status ? data.status.toString() : '0',
                  })(
                    <Select placeholder="请选择运单状态" >
                      <Option value="0" key="0">新建</Option>
                      <Option value="1" key="1">已发货</Option>
                      <Option value="2" key="2">已收货</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="渠道"
                  {...formItemLayout}
                >
                  {getFieldDecorator('type', {
                    initialValue: data.type ? data.type.toString() : undefined,
                  })(
                    <Select placeholder="请选择渠道" >
                      <Option value="1" key="1">包税线</Option>
                      <Option value="2" key="2">身份证线</Option>
                      <Option value="3" key="3">BC线</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="运费"
                  {...formItemLayout}
                >
                  {getFieldDecorator('freight', {
                    initialValue: data.freight,
                  })(
                    <Input placeholder="请输入运费" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="邮编"
                  {...formItemLayout}
                >
                  {getFieldDecorator('postcode', {
                    initialValue: data.postcode,
                  })(
                    <Input placeholder="请输入邮编" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="身份证号"
                  {...formItemLayout}
                >
                  {getFieldDecorator('idCard', {
                    initialValue: data.idCard,
                    rules: [{ validator: this.checkIdCard.bind(this) }],
                  })(
                    <Input placeholder="请输入身份证号" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="备注"
                  {...formItemLayout}
                >
                  {getFieldDecorator('remark', {
                    initialValue: data.remark,
                  })(
                    <Input placeholder="请输入备注" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Table rowSelection={rowSelection} columns={columns} dataSource={data.erpOrderList || []} rowKey={r => r.id} pagination={false} bordered />
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DeliveryModal);
