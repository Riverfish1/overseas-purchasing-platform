import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Row, Col, Form, Modal, Popconfirm } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

class AgencyType extends Component {

  constructor() {
    super();
    this.state = {
      visible: false,
      title: '', // modal的title
    };
  }

  handleSubmit() {
    const { agencyTypeValues = {}, dispatch } = this.prop;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (agencyTypeValues.data) {
        dispatch({
          type: 'agency/updateAgencyType',
          payload: { ...fieldsValue, id: agencyTypeValues.data.id, pageIndex: 1 },
        });
      } else {
        dispatch({
          type: 'agency/addAgencyType',
          payload: { ...fieldsValue, pageIndex: 1 },
        });
      }
    });
  }

  showModal() {
    this.setState({ visible: true, title: '新增' });
  }

  closeModal(visible) {
    this.setState({
      visible,
    });
    this.props.dispatch({
      type: 'agency/updateTypeList',
      payload: {},
    });
  }

  handleUpdate(record) {
    const p = this;
    p.setState({
      visible: true,
    }, () => {
      p.props.dispatch({
        type: 'agency/updateAgencyType',
        payload: { id: record.id },
      });
    });
  }

  handleDelete(id) {
    this.props.dispatch({
      type: 'agency/deleteAgency',
      payload: { id },
    });
  }

  render() {
    const p = this;
    const { form, typeList = [], agencyTypeValues = {} } = p.props;
    console.log(typeList);
    const { getFieldDecorator } = form;
    const { title, visible } = p.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const columns = [
      { title: '类别名称', dataIndex: 'name', key: 'name' },
      { title: '类别代码', dataIndex: 'code', key: 'code' },
      { title: '备注', dataIndex: 'remark', key: 'remark' },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        render(t, r) {
          return (
            <div className={styles.operation}>
              <a href="javascript:void(0)" onClick={p.handleUpdate.bind(p, r)}>修改</a>
              <Popconfirm title="确定删除此类别？" onConfirm={p.handleDelete.bind(p, r)}>
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    const modalProps = {
      title,
      visible,
      closable: true,
      onOk() {
        p.handleSubmit();
      },
      onCancel() {
        p.setState({ visible: false });
      },
    };

    return (
      <div>
        <Row>
          <Col className="orderBtn">
            <Button type="primary" size="large" onClick={p.showModal.bind(p)}>新增类别</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={typeList}
              bordered
              size="large"
              rowKey={record => record.id}
            />
          </Col>
        </Row>
        <Modal {...modalProps}>
          <Form>
            <FormItem
              label="类别名称"
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                initialValue: agencyTypeValues.name,
                rules: [{ required: true, message: '请输入类别名称' }],
              })(
                <Input placeholder="请输入类别名称" />,
              )}
            </FormItem>
            <FormItem
              label="类别代码"
              {...formItemLayout}
            >
              {getFieldDecorator('code', {
                initialValue: agencyTypeValues.code,
                rules: [{ required: true, message: '请输入类别代码' }],
              })(
                <Input placeholder="请输入类别代码" />,
              )}
            </FormItem>
            <FormItem
              label="备注"
              {...formItemLayout}
            >
              {getFieldDecorator('remark', {
                initialValue: agencyTypeValues.remark,
              })(
                <Input placeholder="请输入备注" />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { typeList, agencyTypeValues } = state.agency;
  return {
    agencyTypeValues,
    typeList,
  };
}

export default connect(mapStateToProps)(Form.create()(AgencyType));
