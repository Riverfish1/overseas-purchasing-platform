import React, { Component } from 'react';
import { Form, Table, Row, Col, Button, Modal, Input, Popconfirm, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;

class Organization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
    };
  }
  handleSubmit() {
    const p = this;
    const { orgModal = {}, dispatch, form } = this.props;
    console.log(orgModal);
    form.validateFields((err, values) => {
      if (err) return;
      if (values.createTime) values.createTime = new Date(values.createTime).format('yyyy-MM-dd hh:mm:ss');
      if (orgModal.data) {
        dispatch({ type: 'permission/updateOrg', payload: { ...values, id: orgModal.data.id } });
      } else {
        dispatch({ type: 'permission/addOrg', payload: { ...values } });
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
    this.props.dispatch({ type: 'permission/queryOrg', payload: { id: r.id } });
  }
  handleDelete(r) {
    this.props.dispatch({ type: 'permission/deleteOrg', payload: { id: r.id } });
  }
  render() {
    const p = this;
    const { orgList = [], total, form, orgModal = {} } = this.props;
    const { visible, title } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
    };
    const columns = [
      { title: '组织名', key: 'name', dataIndex: 'name' },
      { title: '地址', key: 'address', dataIndex: 'address' },
      { title: '编号', key: 'code', dataIndex: 'code' },
      { title: '图标', key: 'icon', dataIndex: 'pid' },
      { title: '排序', key: 'seq', dataIndex: 'seq' },
      { title: '创建时间', key: 'createTime', dataIndex: 'createTime' },
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
        p.props.dispatch({ type: 'permission/queryOrgList', payload: { pageIndex } });
      },
    };
    return (
      <div>
        <Row>
          <Col style={{ paddingBottom: '15px' }}>
            <Button type="primary" size="large" onClick={this.showModal.bind(this)}>增加机构</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table columns={columns} dataSource={orgList} rowKey={r => r.id} pagination={paginationProps} bordered />
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
                <FormItem label="组织名" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入组织名' }],
                    initialValue: orgModal.name,
                  })(
                    <Input placeholder="请输入组织名" />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="组织编号" {...formItemLayout}>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入组织编号' }],
                    initialValue: orgModal.code,
                  })(
                    <Input placeholder="请输入组织编号" />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="排序" {...formItemLayout}>
                  {getFieldDecorator('seq', {
                    initialValue: orgModal.seq,
                  })(
                    <Input placeholder="请输入排序" />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="组织地址" {...formItemLayout}>
                  {getFieldDecorator('address', {
                    initialValue: orgModal.address,
                  })(
                    <Input placeholder="请输入组织地址" />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="父级主键" {...formItemLayout}>
                  {getFieldDecorator('pid', {
                    initialValue: orgModal.pid,
                  })(
                    <Input placeholder="请输入父级主键" />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="创建时间" {...formItemLayout}>
                  {getFieldDecorator('createTime', {
                    initialValue: orgModal.createTime ? moment(orgModal.createTime) : undefined,
                  })(
                    <DatePicker style={{ width: '100%' }} showTime />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem label="图标" {...formItemLayout}>
                  {getFieldDecorator('icon', {
                    initialValue: orgModal.icon,
                  })(
                    <Input placeholder="请输入图标" />,
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
  const { orgList, orgTotal, orgModal } = state.permission;
  return { orgList, total: orgTotal, orgModal };
}

export default connect(mapStateToProps)(Form.create()(Organization));