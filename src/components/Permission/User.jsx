import React, { Component } from 'react';
import { Form, Table, Row, Col, Button, Modal, Input, Popconfirm, DatePicker, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import isNull from '../../utils/isNull';

const FormItem = Form.Item;
const Option = Select.Option;

class Resource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
    };
  }
  handleSubmit() {
    const p = this;
    const { userModal = {}, dispatch, form } = this.props;
    console.log(userModal);
    form.validateFields((err, values) => {
      if (err) return;
      if (values.createTime) values.createTime = new Date(values.createTime).format('yyyy-MM-dd hh:mm:ss');
      if (userModal.id) {
        dispatch({ type: 'permission/updateUser', payload: { ...values, id: userModal.id } });
      } else {
        dispatch({ type: 'permission/addUser', payload: { ...values } });
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
    this.props.dispatch({ type: 'permission/queryUser', payload: { id: r.id } });
  }
  handleDelete(r) {
    this.props.dispatch({ type: 'permission/deleteUser', payload: { id: r.id } });
  }
  render() {
    const p = this;
    const { userList = [], total, form, userModal = {} } = this.props;
    const { visible, title } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: '登录名', key: 'loginName', dataIndex: 'loginName' },
      { title: '姓名', key: 'name', dataIndex: 'name' },
      { title: '所属部门', key: 'organizationName', dataIndex: 'organizationName' },
      { title: '创建时间', key: 'createTime', dataIndex: 'createTime' },
      { title: '性别', key: 'sex', dataIndex: 'sex' },
      { title: '年龄', key: 'age', dataIndex: 'age' },
      { title: '手机号', key: 'phone', dataIndex: 'phone' },
      { title: '角色',
        key: 'roleList',
        dataIndex: 'roleList',
        render(t) {
          return t && t[0] && t[0].name;
        },
      },
      { title: '用户类型',
        key: 'userType',
        dataIndex: 'userType',
        render(t) {
          if (t === 0) return '管理员';
          return '用户';
        },
      },
      { title: '状态',
        key: 'status',
        dataIndex: 'status',
        render(t) {
          if (t === 0) return '正常';
          return '停用';
        },
      },
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
        p.props.dispatch({ type: 'permission/queryUserList', payload: { pageIndex } });
      },
    };

    return (
      <div>
        <Row>
          <Col style={{ paddingBottom: '15px' }}>
            <Button type="primary" size="large" onClick={this.showModal.bind(this)}>增加用户</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table columns={columns} dataSource={userList} rowKey={r => r.id} pagination={paginationProps} bordered />
          </Col>
        </Row>
        <Modal
          visible={visible}
          width={600}
          title={title}
          onOk={this.handleSubmit.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <Form>
            <Row>
              <Col span={12}>
                <FormItem label="用户名" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入用户名' }],
                    initialValue: userModal.name,
                  })(
                    <Input placeholder="请输入用户名" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="登录名" {...formItemLayout}>
                  {getFieldDecorator('loginName', {
                    rules: [{ required: true, message: '请输入登录名' }],
                    initialValue: userModal.loginName,
                  })(
                    <Input placeholder="请输入登录名" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="性别" {...formItemLayout}>
                  {getFieldDecorator('sex', {
                    rules: [{ required: true, message: '请选择性别' }],
                    initialValue: !isNull(userModal.sex) ? userModal.sex.toString() : '1',
                  })(
                    <Select placeholder="请选择性别">
                      <Option value="1">男</Option>
                      <Option value="0">女</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              {/* <Col span={12}>
                <FormItem label="年龄" {...formItemLayout}>
                  {getFieldDecorator('age', {
                    rules: [{ required: true, message: '请输入年龄' }],
                    initialValue: userModal.age,
                  })(
                    <Input placeholder="请输入年龄" />,
                  )}
                </FormItem>
              </Col> */}
              <Col span={12}>
                <FormItem label="手机号" {...formItemLayout}>
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: '请输入手机号' }],
                    initialValue: userModal.phone,
                  })(
                    <Input placeholder="请输入手机号" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="状态" {...formItemLayout}>
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择状态' }],
                    initialValue: !isNull(userModal.status) ? userModal.status.toString() : '1',
                  })(
                    <Select placeholder="请选择状态">
                      <Option value="1">正常</Option>
                      <Option value="0">禁用</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              {/* <Col span={12}>
                <FormItem label="用户类别" {...formItemLayout}>
                  {getFieldDecorator('userType', {
                    rules: [{ required: true, message: '请输入用户类别' }],
                    initialValue: userModal.userType,
                  })(
                    <Input placeholder="请输入用户类别" />,
                  )}
                </FormItem>
              </Col> */}
              <Col span={12}>
                <FormItem label="所属机构ID" {...formItemLayout}>
                  {getFieldDecorator('organizationId', {
                    rules: [{ required: true, message: '请输入所属机构ID' }],
                    initialValue: userModal.organizationId,
                  })(
                    <Input placeholder="请输入所属机构ID" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="角色ID" {...formItemLayout}>
                  {getFieldDecorator('roleIds', {
                    rules: [{ required: true, message: '请输入角色ID' }],
                    initialValue: userModal.roleIds,
                  })(
                    <Input placeholder="请输入角色ID" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="创建时间" {...formItemLayout}>
                  {getFieldDecorator('createTime', {
                    initialValue: userModal.createTime ? moment(userModal.createTime) : undefined,
                  })(
                    <DatePicker style={{ width: '100%' }} showTime />,
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
  const { userList, userTotal, userModal } = state.permission;
  return { userList, total: userTotal, userModal };
}

export default connect(mapStateToProps)(Form.create()(Resource));
