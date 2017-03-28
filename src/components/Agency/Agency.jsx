import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Select, Form, Popconfirm } from 'antd';
import AgencyModal from './AgencyModal';

const FormItem = Form.Item;
const Option = Select.Option;

class Agency extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
      visible: false,
      title: '', // modal的title
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'agency/queryAgencyList',
        payload: { ...fieldsValue, pageIndex: 1 },
      });
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
      title: '新增',
    });
  }

  updateModal(id) {
    const p = this;
    p.setState({
      modalVisible: true,
      title: '修改',
    }, () => {
      p.props.dispatch({ type: 'agency/queryAgency', payload: { id } });
    });
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
    this.props.dispatch({
      type: 'agency/saveAgency',
      payload: {},
    });
  }

  handleProDetail(record) {
    const p = this;
    p.setState({
      visible: true,
    }, () => {
      p.props.dispatch({
        type: 'order/queryOrder',
        payload: { id: record.id, type: 'snip' },
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
    const { form, list = [], total, currentPage, agencyValues = {}, dispatch } = p.props;
    const { getFieldsValue, getFieldDecorator, resetFields } = form;
    const { title } = p.state;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const columnsList = [
      { title: '经销商名称', dataIndex: 'name', key: 'name' },
      { title: '用户id', dataIndex: 'userId', key: 'userId', render(text) { return text || '-'; } },
      { title: '用户名称', dataIndex: 'userName', key: 'userName', render(text) { return text || '-'; } },
      { title: '经销商代码', dataIndex: 'code', key: 'code', render(text) { return text || '-'; } },
      { title: '经销商类别Id', dataIndex: 'typeId', key: 'typeId', render(text) { return text || '-'; } },
      { title: '经销商类别名称', dataIndex: 'typeName', key: 'typeName', render(text) { return text || '-'; } },
      { title: '经销商类别代码', dataIndex: 'typeCode', key: 'typeCode', render(text) { return text || '-'; } },
      { title: '创建时间', dataIndex: 'gmtCreate', key: 'gmtCreate', render(text) { return text || '-'; } },
      { title: '修改时间', dataIndex: 'gmtModify', key: 'gmtModify', render(text) { return text || '-'; } },
      { title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 200,
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" onClick={p.updateModal.bind(p, record.id)}>修改</a>
              <Popconfirm title="确定删除此经销商？" onConfirm={p.handleDelete.bind(p, record.id)}>
                <a href="javascript:void(0)" style={{ marginLeft: 10 }}>删除</a>
              </Popconfirm>
            </div>);
        },
      },
    ];

    const listPaginationProps = {
      total,
      current: currentPage,
      pageSize: 10,
      onChange(page) {
        const values = getFieldsValue();
        const payload = {};
        Object.keys(values).forEach((key) => {
          if (values[key]) {
            payload[key] = values[key];
          }
        });
        p.props.dispatch({
          type: 'order/queryOrderList',
          payload: { ...payload, pageIndex: page },
        });
      },
    };

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={20} style={{ width: 800 }}>
            <Col span="8">
              <FormItem
                label="经销商名称"
                {...formItemLayout}
              >
                {getFieldDecorator('name', {})(
                  <Select placeholder="请选择经销商名称">
                    {list.map((el, index) => <Option key={index} value={el.name}>{el.name}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="经销商类别名称"
                {...formItemLayout}
              >
                {getFieldDecorator('typeId', {})(
                  <Select placeholder="请选择经销商类别名称">
                    {list.map((el, index) => <Option key={index} value={el.typeId.toString()}>{el.typeName}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className="listBtnGroup">
              <Button htmlType="submit" size="large" type="primary">查询</Button>
              <Button size="large" type="ghost" onClick={() => { resetFields(); }}>清空</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col className="operBtn">
            <Button type="primary" size="large" onClick={p.showModal.bind(p)}>新增经销商</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columnsList}
              dataSource={list}
              bordered
              size="large"
              rowKey={record => record.id}
              pagination={listPaginationProps}
            />
          </Col>
        </Row>
        <AgencyModal
          visible={this.state.modalVisible}
          list={list}
          close={this.closeModal.bind(this)}
          modalValues={agencyValues}
          title={title}
          dispatch={dispatch}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { list, total, agencyValues } = state.agency;
  return {
    list,
    total,
    agencyValues,
  };
}

export default connect(mapStateToProps)(Form.create()(Agency));
