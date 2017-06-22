import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Form, Table, Row, Col, Button, Modal } from 'antd';

const FormItem = Form.Item;

@window.regStateCache
class Brands extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
    };
  }
  handleCancel() {
    this.setState({ visible: false });
    this.props.dispatch({
      type: 'products/queryBrand',
      payload: {},
    });
  }
  showModal(type, id) {
    const p = this;
    this.setState({
      visible: true,
      title: id ? '修改' : '新增',
    }, () => {
      if (id) {
        p.props.dispatch({
          type: 'products/queryBrand',
          payload: { id },
        });
      }
    });
  }
  handleDelete(id) {
    this.props.dispatch({
      type: 'products/deleteBrand',
      payload: { id },
    });
  }
  handleOkClick() {
    const { dispatch, brandValue, form } = this.props;
    form.validateFields((err, values) => {
      if (brandValue.data) {
        dispatch({
          type: 'products/updateBrand',
          payload: { ...values, id: brandValue.data.id },
        });
      } else {
        dispatch({
          type: 'products/addBrand',
          payload: { ...values },
        });
      }
      this.handleCancel();
    });
  }
  render() {
    const p = this;
    const { form, brands = [], brandValue = {} } = this.props;
    const { visible, title } = this.state;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    };
    const columns = [
      { title: '品牌ID', dataIndex: 'id', key: 'id' },
      { title: '品牌名称', dataIndex: 'name', key: 'name' },
      { titel: '操作',
        key: 'oper',
        render(t, r) {
          return (
            <div>
              <a href="javascript:void(0)" onClick={p.showModal.bind(p, 'update', r.id)} style={{ margin: '0 10px' }}>修改</a>
              <a href="javascript:void(0)" onClick={p.handleDelete.bind(p, r.id)} >删除</a>
            </div>
          );
        },
      },
    ];
    return (
      <div>
        <div className="refresh-btn"><Button type="ghost" size="small" onClick={this._refreshData.bind(this)}>刷新</Button></div>
        <Row>
          <Col className="operBtn">
            <Button type="primary" size="large" onClick={p.showModal.bind(p, 'add')}>新增品牌</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={brands} rowKey={r => r.id} />
        <Modal visible={visible} title={title} onCancel={this.handleCancel.bind(this)} onOk={this.handleOkClick.bind(this)}>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="品牌ID"
                {...formItemLayout}
              >
                {getFieldDecorator('id', {
                  initialValue: brandValue.data.id.toString(),
                  rules: [{ required: true, message: '请输入品牌ID' }],
                })(
                  <Input placeholder="请输入品牌ID" />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="品牌名称"
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  initialValue: brandValue.data.name,
                  rules: [{ required: true, message: '请输入品牌名称' }],
                })(
                  <Input placeholder="请输入品牌名称" />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { brands, brandValue } = state.products;
  return { brands, brandValue };
}

export default connect(mapStateToProps)(Form.create()(Brands));
