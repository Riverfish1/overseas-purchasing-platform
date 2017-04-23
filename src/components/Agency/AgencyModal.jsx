import React, { Component } from 'react';
import { Modal, Input, Row, Col, Select, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

import style from './index.less';

moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

function toString(str, type) {
  if (typeof str !== 'undefined' && str !== null) return str.toString();
  if (type === 'SELECT') return undefined;
  return '';
}

class AgencyModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      typeId: '',
    };
  }

  handleSubmit() {
    const { form, modalValues } = this.props;
    const { userId, typeId } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (modalValues.data) {
        this.props.dispatch({
          type: 'agency/updateAgency',
          payload: { ...values, userId: modalValues.data.userId, typeId: modalValues.data.typeId, id: modalValues.id },
        });
      } else {
        this.props.dispatch({
          type: 'agency/addAgency',
          payload: { ...values, userId, typeId },
        });
      }
      this.closeModal();
    });
  }

  closeModal() {
    const { form, close } = this.props;
    form.resetFields();
    close(false);
  }

  handleChange(name) {
    const p = this;
    const { form, list = [] } = this.props;
    list.forEach((item) => {
      if (item.name === name) {
        form.setFieldsValue({
          typeCode: item.code,
        });
        p.setState({
          userId: item.id,
          // typeId: item.typeId,
        });
      }
    });
  }

  render() {
    const p = this;
    const { form, visible, modalValues = {}, list = [] } = this.props;
    const { getFieldDecorator } = form;

    // 详情数据
    const agencyData = (modalValues && modalValues.data) || {};

    const modalProps = {
      visible,
      wrapClassName: 'modalStyle',
      title: '添加',
      maskClosable: false,
      closable: true,
      onOk() {
        p.handleSubmit();
      },
      onCancel() {
        p.closeModal();
      },
    };
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };

    return (
      <Modal
        {...modalProps}
        className={style.modalStyle}
      >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row>
            <Col>
              <FormItem
                label="销售类别"
                {...formItemLayout}
              >
                {getFieldDecorator('typeName', {
                  initialValue: toString(agencyData.typeName, 'SELECT'),
                  rules: [{ required: true, message: '请选择销售类别' }],
                })(
                  <Select placeholder="请选择销售名称" onChange={this.handleChange.bind(this)} >
                    {list.map((el, index) => <Option key={index} value={el.name}>{el.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem
                label="用户名称"
                {...formItemLayout}
              >
                {getFieldDecorator('userName', {
                  initialValue: toString(agencyData.userName),
                  rules: [{ required: true, message: '请输入用户名称' }],
                })(
                  <Input placeholder="请输入用户名称" />,
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem
                label="销售代码"
                {...formItemLayout}
              >
                {getFieldDecorator('code', {
                  initialValue: toString(agencyData.code),
                  rules: [{ required: true, message: '请输入销售代码' }],
                })(
                  <Input placeholder="请输入销售代码" />,
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem
                label="销售类别代码"
                {...formItemLayout}
              >
                {getFieldDecorator('typeCode', {
                  initialValue: toString(agencyData.typeCode),
                  rules: [{ required: true, message: '请选择销售名称' }],
                })(
                  <Input placeholder="请选择销售名称" disabled={true} />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AgencyModal);
