import React, { Component } from 'react';
import { Form, Table, Row, Col, Button, Modal, Input, Popconfirm, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

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
    const { resourceModal = {}, dispatch, form } = this.props;
    console.log(resourceModal);
    form.validateFields((err, values) => {
      if (err) return;
      if (values.createTime) values.createTime = new Date(values.createTime).format('yyyy-MM-dd hh:mm:ss');
      if (resourceModal.id) {
        dispatch({ type: 'permission/updateResource', payload: { ...values, id: resourceModal.id } });
      } else {
        dispatch({ type: 'permission/addResource', payload: { ...values } });
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
    this.props.dispatch({ type: 'permission/queryResource', payload: { id: r.id } });
  }
  handleDelete(r) {
    this.props.dispatch({ type: 'permission/deleteResource', payload: { id: r.id } });
  }
  render() {
    const p = this;
    const { resourceList = [], total, form, resourceModal = {} } = this.props;
    const { visible, title } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      { title: '资源名称', key: 'name', dataIndex: 'name' },
      { title: '资源路径', key: 'url', dataIndex: 'url' },
      { title: '打开方式', key: 'openMode', dataIndex: 'openMode' },
      { title: '父级资源ID', key: 'pid', dataIndex: 'pid' },
      { title: '状态', key: 'status', dataIndex: 'status' },
      { title: '图标', key: 'icon', dataIndex: 'icon' },
      { title: '资源类别', key: 'resourceType', dataIndex: 'resourceType' },
      { title: '资源编码', key: 'resCode', dataIndex: 'resCode' },
      { title: '排序', key: 'seq', dataIndex: 'seq' },
      { title: '创建时间', key: 'createTime', dataIndex: 'createTime' },
      { title: '资源介绍', key: 'description', dataIndex: 'description' },
      { title: '操作',
        key: 'oper',
        dataIndex: 'oper',
        render(t, r) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={p.handleQuery.bind(p, r)}>修改</a>
              <Popconfirm title="确定删除？" onConfirm={p.handleDelete.bind(p, r)}>
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
        p.props.dispatch({ type: 'permission/queryResourceList', payload: { pageIndex } });
      },
    };
    return (
      <div>
        <Row>
          <Col style={{ paddingBottom: '15px' }}>
            <Button type="primary" size="large" onClick={this.showModal.bind(this)}>增加资源</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table columns={columns} dataSource={resourceList} rowKey={r => r.id} pagination={paginationProps} bordered />
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
                <FormItem label="资源名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入资源名称' }],
                    initialValue: resourceModal.name,
                  })(
                    <Input placeholder="请输入资源名称" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="资源类别" {...formItemLayout}>
                  {getFieldDecorator('resourceType', {
                    rules: [{ required: true, message: '请输入资源类别' }],
                    initialValue: resourceModal.resourceType,
                  })(
                    <Input placeholder="请输入资源类别" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="资源编码" {...formItemLayout}>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入资源编码' }],
                    initialValue: resourceModal.code,
                  })(
                    <Input placeholder="请输入资源编码" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="排序" {...formItemLayout}>
                  {getFieldDecorator('seq', {
                    rules: [{ required: true, message: '请输入排序' }],
                    initialValue: resourceModal.seq,
                  })(
                    <Input placeholder="请输入排序" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="状态" {...formItemLayout}>
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请输入状态' }],
                    initialValue: resourceModal.status,
                  })(
                    <Input placeholder="请输入状态" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="资源路径" {...formItemLayout}>
                  {getFieldDecorator('url', {
                    initialValue: resourceModal.url,
                  })(
                    <Input placeholder="请输入资源路径" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="打开方式" {...formItemLayout}>
                  {getFieldDecorator('openMode', {
                    initialValue: resourceModal.openMode || undefined,
                  })(
                    <Select placeholder="请选择打开方式" >
                      <Option value="ajax">ajax</Option>
                      <Option value="iframe">iframe</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="父级资源ID" {...formItemLayout}>
                  {getFieldDecorator('pid', {
                    initialValue: resourceModal.pid,
                  })(
                    <Input placeholder="请输入父级资源ID" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="资源介绍" {...formItemLayout}>
                  {getFieldDecorator('description', {
                    initialValue: resourceModal.description,
                  })(
                    <Input placeholder="请输入资源介绍" />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="创建时间" {...formItemLayout}>
                  {getFieldDecorator('createTime', {
                    initialValue: resourceModal.createTime ? moment(resourceModal.createTime) : undefined,
                  })(
                    <DatePicker style={{ width: '100%' }} showTime />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="资源图标" {...formItemLayout}>
                  {getFieldDecorator('icon', {
                    initialValue: resourceModal.icon,
                  })(
                    <Input placeholder="请输入资源图标" />,
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
  const { resourceList, resourceTotal, resourceModal } = state.permission;
  return { resourceList, total: resourceTotal, resourceModal };
}

export default connect(mapStateToProps)(Form.create()(Resource));
