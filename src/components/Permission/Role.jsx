import React, { Component } from 'react';
import { Form, Table, Row, Col, Button, Modal, Input, Popconfirm } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
    };
  }
  handleSubmit() {
    const p = this;
    const { roleModal = {}, dispatch, form } = this.props;
    console.log(roleModal);
    form.validateFields((err, values) => {
      if (err) return;
      if (roleModal.id) {
        dispatch({ type: 'permission/updateRole', payload: { ...values, id: roleModal.id } });
      } else {
        dispatch({ type: 'permission/addRole', payload: { ...values } });
      }
      p.handleCancel();
    });
  }
  handleCancel() {
    this.setState({ visible: false });
    this.props.form.resetFields();
  }
  showModal() {
    this.setState({ visible: true, title: '新增' });
  }
  handleQuery(r) {
    this.setState({ visible: true, title: '修改' });
    this.props.dispatch({ type: 'permission/queryRole', payload: { id: r.id } });
  }
  handleDelete(r) {
    this.props.dispatch({ type: 'permission/deleteRole', payload: { id: r.id } });
  }
  render() {
    const p = this;
    const { roleList = [], total, form, roleModal = {} } = this.props;
    const { visible, title } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    const columns = [
      { title: '角色名称', key: 'name', dataIndex: 'name' },
      { title: '排序', key: 'seq', dataIndex: 'seq' },
      { title: '状态', key: 'status', dataIndex: 'status' },
      { title: '角色介绍', key: 'description', dataIndex: 'description' },
      { title: '操作',
        key: 'oper',
        dataIndex: 'oper',
        render(t, r) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={p.handleQuery.bind(p, r)}>修改</a>
              <Popconfirm title="确定删除" onConfirm={p.handleDelete.bind(p, r)}>
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    const paginationProps = {
      total,
      pageSize: 10,
      onChange(pageIndex) {
        p.props.dispatch({ type: 'permission/queryRoleList', payload: { pageIndex } });
      },
    };
    return (
      <div>
        <Row>
          <Col style={{ paddingBottom: '15px' }}>
            <Button type="primary" size="large" onClick={this.showModal.bind(this)}>增加角色</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table columns={columns} dataSource={roleList} rowKey={r => r.id} pagination={paginationProps} bordered />
          </Col>
        </Row>
        <Modal
          visible={visible}
          title={title}
          onOk={this.handleSubmit.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <Form>
            <Row>
              <Col>
                <FormItem label="角色名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入角色名称' }],
                    initialValue: roleModal.name,
                  })(
                    <Input placeholder="请输入角色名称" />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="排序" {...formItemLayout}>
                  {getFieldDecorator('seq', {
                    rules: [{ required: true, message: '请输入排序' }],
                    initialValue: roleModal.seq,
                  })(
                    <Input placeholder="请输入排序" />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="状态" {...formItemLayout}>
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请输入状态' }],
                    initialValue: roleModal.status,
                  })(
                    <Input placeholder="请输入状态" />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="角色介绍" {...formItemLayout}>
                  {getFieldDecorator('description', {
                    initialValue: roleModal.description,
                  })(
                    <Input placeholder="请输入角色介绍" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>);
  }
}

function mapStateToProps(state) {
  const { roleList, roleTotal, roleModal } = state.permission;
  return { roleList, total: roleTotal, roleModal };
}

export default connect(mapStateToProps)(Form.create()(Role));
