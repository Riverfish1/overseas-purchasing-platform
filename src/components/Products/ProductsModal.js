import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Modal, Table, Pagination, Input, Button, Row, Col, Select, DatePicker, Form, Icon } from 'antd';
import styles from './Products.less';

const FormItem = Form.Item;
const Option = Select.Option;

class ProductsModal extends Component {

  constructor() {
    super();
    this.state = {

    };
  }

  handleSubmit(e) {
    console.log(e);
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      
    });
  }

  addSKU() {

  }

  render() {
    let that = this;
    const { form, visible, close } = this.props;
    const { getFieldDecorator } = form;
    const modalProps = {
      visible,
      width: 800,
      title: '添加',
      maskClosable: false,
      closable: true,
      onOk() {
        that.handleSubmit();
      },
      onCancel() {
        close(false);
      },
    };
    const formItemLayout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    };
    const tableProps = {
      columns: [
        {
          title: '序号', dataIndex: 'order', key: 'order',
          render(record, index) {
            return index + 1;
          },
        },
        {
          title: '尺寸', dataIndex: 'size', key: 'size',
          render(record, index) {
            return <Input />
          },
        },
        {
          title: '颜色', dataIndex: 'color', key: 'color',
          render(record, index) {
            return <Input />
          },
        },
        {
          title: '库存', dataIndex: 'inventory', key: 'inventory',
          render(record, index) {
            return <Input />
          },
        },
        {
          title: '虚拟库存', dataIndex: 'virtualInventory', key: 'virtualInventory',
          render(record, index) {
            return <Input />
          },
        },
        {
          title: 'barcode', dataIndex: 'barcode', key: 'barcode',
          render(record, index) {
            return <Input />
          },
        },
        {
          title: '重量(KG)', dataIndex: 'weight', key: 'weight',
          render(record, index) {
            return <Input />
          },
        },
        {
          title: '操作', dataIndex: 'operator', key: 'operator',
          render(record, index) {
            return <Input />
          },
        },
      ],
    };
    return (
      <Modal 
        {...modalProps}
      >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="商品编码"
                {...formItemLayout}
              >
                {getFieldDecorator('productCode', {
                  rules: [{ required: true, message: '请输入商品编码' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('productName', {
                  rules: [{ required: true, message: '请输入商品名称' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="英文名称"
                {...formItemLayout}
              >
                {getFieldDecorator('enName', {
                  rules: [{ required: true, message: '请输入英文名称' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>          
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="商品简称"
                {...formItemLayout}
              >
                {getFieldDecorator('productAbbr', {
                  rules: [{ required: true, message: '请输入商品简称' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="所属类目"
                {...formItemLayout}
              >
                {getFieldDecorator('category', {
                  rules: [{ required: true, message: '请输入所属类目' }],
                })(
                  <Select />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="品牌"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {
                  rules: [{ required: true, message: '请输入品牌' }],
                })(
                  <Select />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="国家"
                {...formItemLayout}
              >
                {getFieldDecorator('country', {
                  rules: [{ required: true, message: '请输入国家' }],
                })(
                  <Select />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="币种"
                {...formItemLayout}
              >
                {getFieldDecorator('currency', {
                  rules: [{ required: true, message: '请输入币种' }],
                })(
                  <Select />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="是否身份证"
                {...formItemLayout}
              >
                {getFieldDecorator('isIdCard', {
                  rules: [{ required: true, message: '请输入是否身份证' }],
                })(
                  <Select />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="销售开始时间"
                {...formItemLayout}
              >
                {getFieldDecorator('startTime', {
                  rules: [{ required: true, message: '请输入商品编码' }],
                })(
                  <DatePicker />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="销售结束时间"
                {...formItemLayout}
              >
                {getFieldDecorator('endTime', {
                  rules: [{ required: true, message: '请输入商品名称' }],
                })(
                  <DatePicker />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="采购站点"
                {...formItemLayout}
              >
                {getFieldDecorator('enName', {
                  rules: [{ required: true, message: '请输入英文名称' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="规格"
                {...formItemLayout}
              >
                {getFieldDecorator('spec', {
                  rules: [{ required: true, message: '请输入规格' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="型号"
                {...formItemLayout}
              >
                {getFieldDecorator('model', {
                  rules: [{ required: true, message: '请输入型号' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem
                label="重量"
                style={{ marginLeft: 10 }}
                labelCol={{ span: 7}}
                wrapperCol={{ span: 14 }}
              >
                {getFieldDecorator('weight', {
                  rules: [{ required: true, message: '请输入重量' }],
                })(
                  <Input style={{width: 117}} />
                )}  KG
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="单位"
                {...formItemLayout}
              >
                {getFieldDecorator('unit', {
                  rules: [{ required: true, message: '请输入单位' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="来源"
                {...formItemLayout}
              >
                {getFieldDecorator('source', {
                  rules: [{ required: true, message: '请输入来源' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="联系人"
                {...formItemLayout}
              >
                {getFieldDecorator('linkman', {
                  rules: [{ required: true, message: '请输入联系人' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={7}>
              <FormItem
                label="产地"
                {...formItemLayout}
              >
                {getFieldDecorator('region', {
                  rules: [{ required: true, message: '请输入产地' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="联系电话"
                {...formItemLayout}
              >
                {getFieldDecorator('contactPhone', {
                  rules: [{ required: true, message: '请输入联系电话' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="备注"
                {...formItemLayout}
              >
                {getFieldDecorator('note', {
                  rules: [{ required: true, message: '请输入备注' }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={this.addSKU.bind(this)}>新增SKU</Button>
            </Col>
          </Row>
          <Table
            {...tableProps}
          />
        </Form>
      </Modal>
    );
    
  }

}

function mapStateToProps(state) {
  const { dataSource } = state.products;
  return {
    loading: state.loading.models.users,
    dataSource,
  };
}

ProductsModal = Form.create()(ProductsModal);

export default connect(mapStateToProps)(ProductsModal);
