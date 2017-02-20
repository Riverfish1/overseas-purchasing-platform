import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Modal, Table, Pagination, Input, InputNumber, Button, Row, Col, Select, DatePicker, Form, Icon } from 'antd';
import styles from './Products.less';

const FormItem = Form.Item;
const Option = Select.Option;

class ProductsModal extends Component {

  constructor() {
    super();
    this.state = {
      skuList: [], // sku数据
    };
  }

  handleSubmit() {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log(fieldsValue);
      const values = {
        ...fieldsValue,
        'startDate': fieldsValue['startDate'].format('YYYY-MM-DD'),
        'endDate': fieldsValue['endDate'].format('YYYY-MM-DD'),
      };
      dispatch({
        type: 'products/addProducts',
        payload: { ...values },
      });
    });
  }

  addSKU() {
    const { skuList } = this.state;
    const { form } = this.props;
    const { setFieldsValue } = form;
    let id = 1;
    skuList.push({
      color: '', scale: '', inventory: '', virtualInventory: '', weight: '', skuCode: '', id,
    });
  }

  handleDelete(id) {
    const { skuList } = this.state;
    skuList.filter(item => id !== item.id);
  }

  render() {
    let that = this;
    const { form, visible, close } = this.props;
    const { getFieldDecorator } = form;
    const modalProps = {
      visible,
      width: 900,
      wrapClassName: 'modalStyle',
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
          title: '序号', key: 'order', width: '6%',
          render(text, record, index) {
            return index + 1;
          },
        },
        {
          title: '尺寸', dataIndex: 'scale', key: 'scale', width: '14%',
          render(text, record, index) {
            return <Input value={text} />
          },
        },
        {
          title: '颜色', dataIndex: 'color', key: 'color', width: '14%',
          render(text, record, index) {
            return <Input value={text} />
          },
        },
        {
          title: '库存', dataIndex: 'inventory', key: 'inventory', width: '14%',
          render(text, record, index) {
            return <Input value={text} />
          },
        },
        {
          title: '虚拟库存', dataIndex: 'virtualInventory', key: 'virtualInventory', width: '14%',
          render(text, record, index) {
            return <Input value={text} />
          },
        },
        {
          title: 'barcode', dataIndex: 'skuCode', key: 'skuCode', width: '14%',
          render(text, record, index) {
            return <Input value={text} />
          },
        },
        {
          title: '重量(KG)', dataIndex: 'weight', key: 'weight', width: '14%',
          render(text, record, index) {
            return <Input value={text} />
          },
        },
        {
          title: '操作', key: 'operator',
          render(text, record, index) {
            return <a href="javascript:void(0)" onClick={that.handleDelete.bind(this, record.id)}>删除</a>
          },
        },
      ],
      dataSource: this.state.skuList,
      borderde: false,
      pagination: true,
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
                {getFieldDecorator('itemCode', {
                  rules: [{ required: true, message: '请输入商品编码' }],
                })(
                  <Input placeholder="请输入商品编码" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="商品名称"
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入商品名称' }],
                })(
                  <Input placeholder="请输入商品名称" />
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
                  <Input placeholder="请输入英文名称" />
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
                {getFieldDecorator('itemShort', {
                  rules: [{ required: true, message: '请输入商品简称' }],
                })(
                  <Input placeholder="请输入商品简称" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="所属类目"
                {...formItemLayout}
              >
                {getFieldDecorator('categoryId', {
                  rules: [{ required: true, message: '请选择所属类目' }],
                })(
                  <Select placeholder="请选择所属类目" >
                    <Option value="1">衣服</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="品牌"
                {...formItemLayout}
              >
                {getFieldDecorator('brand', {
                  rules: [{ required: true, message: '请选择品牌' }],
                })(
                  <Select placeholder="请选择品牌" >
                    <Option value="100">优衣库</Option>
                  </Select>
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
                  rules: [{ required: true, message: '请选择国家' }],
                })(
                  <Select placeholder="请选择国家">
                    <Option value="1">美国</Option>
                    <Option value="2">德国</Option>
                    <Option value="3">日本</Option>
                    <Option value="4">澳洲</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="币种"
                {...formItemLayout}
              >
                {getFieldDecorator('currency', {
                  rules: [{ required: true, message: '请选择币种' }],
                })(
                  <Select placeholder="请选择币种">
                    <Option value="1">人民币</Option>
                    <Option value="2">美元</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="是否身份证"
                {...formItemLayout}
              >
                {getFieldDecorator('idCard', {
                  rules: [{ required: true, message: '请选择是否身份证' }],
                })(
                  <Select placeholder="请选择是否身份证">
                    <Option value="1">是</Option>
                    <Option value="2">否</Option>
                  </Select>
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
                {getFieldDecorator('startDate', {
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
                {getFieldDecorator('endDate', {
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
                {getFieldDecorator('buySite', {
                  rules: [{ required: true, message: '请输入采购站点' }],
                })(
                  <Input placeholder="请输入采购站点" />
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
                  <Input placeholder="请输入规格" />
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
                  <Input placeholder="请输入型号" />
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
                  initialValue: '0',
                  rules: [{ required: true, message: '请输入重量' }],
                })(
                  <InputNumber step={0.01} min={0} style={{width: 133.5}} placeholder="请输入重量" />
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
                  <Input placeholder="请输入单位" />
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
                  <Input placeholder="请输入来源" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="联系人"
                {...formItemLayout}
              >
                {getFieldDecorator('contactPerson', {
                  rules: [{ required: true, message: '请输入联系人' }],
                })(
                  <Input placeholder="请输入联系人" />
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
                {getFieldDecorator('origin', {
                  rules: [{ required: true, message: '请输入产地' }],
                })(
                  <Input placeholder="请输入产地" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="联系电话"
                {...formItemLayout}
              >
                {getFieldDecorator('contactTel', {
                  rules: [{ required: true, message: '请输入联系电话' }],
                })(
                  <Input placeholder="请输入联系电话" />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label="备注"
                {...formItemLayout}
              >
                {getFieldDecorator('remark', {
                  rules: [{ message: '请输入备注' }],
                })(
                  <Input placeholder="请输入备注" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type="primary" onClick={this.addSKU.bind(this)}>新增SKU</Button>
            </Col>
          </Row>
          <Row>
            <Table
              {...tableProps}
              rowKey={record => record.id}
            />
          </Row>
        </Form>
      </Modal>
    );
    
  }

}

function mapStateToProps(state) {
  const { dataSource } = state.products;
  return {
    loading: state.loading.models.products,
    dataSource,
  };
}

ProductsModal = Form.create()(ProductsModal);

export default connect(mapStateToProps)(ProductsModal);
