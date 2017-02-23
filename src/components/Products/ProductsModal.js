import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Modal, Table, Pagination, Input, InputNumber, Button, Row, Col, Select, DatePicker, Form, Icon, Popconfirm } from 'antd';
import styles from './Products.less';

const FormItem = Form.Item;
const Option = Select.Option;

let uuid = 1;

class ProductsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      skuList: [], // sku数据
    };
  }

  componentWillMount() {
    const { modalValues, form } = this.props;
    const { setFieldsValue } = form;
    modalValues && setFieldsValue({
      brand: modalValues.brand,
      buySite: modalValues.buySite,
      categoryName: modalValues.categoryName,
      contactPerson: modalValues.contactPerson,
      contactTel: modalValues.contactTel,
      country: modalValues.country,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
      brand: modalValues.brand,
    })
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
      console.log(values);
      dispatch({
        type: 'products/addProducts',
        payload: { ...values },
      });
    });
  }

  addSKU() {
    const { skuList } = this.state;
    const obj = {
      color: '', scale: '', inventory: '', virtualInventory: '', weight: '', skuCode: '', id: uuid, order: uuid,    
    };
    uuid += 1;
    skuList.push(obj);
  }

  handleDelete(id) {
    const { skuList } = this.state;
    let skuData = skuList.filter(item => id !== item.id);
    this.setState({ skuList: skuData });
  }

  render() {
    let p = this;
    const { form, visible, close, brands } = this.props;
    const { getFieldDecorator } = form;
    const modalProps = {
      visible,
      width: 900,
      wrapClassName: 'modalStyle',
      title: '添加',
      maskClosable: false,
      closable: true,
      onOk() {
        p.handleSubmit();
      },
      onCancel() {
        close(false);
      },
    };
    const formItemLayout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    };
    const modalTableProps = {
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
            return <div>{getFieldDecorator('scale', {})(<Input />)}</div>
          },
        },
        {
          title: '颜色', dataIndex: 'color', key: 'color', width: '14%',
          render(text, record, index) {
            return <div>{getFieldDecorator('color', {})(<Input />)}</div>
          },
        },
        {
          title: '库存', dataIndex: 'inventory', key: 'inventory', width: '14%',
          render(text, record, index) {
            return <div>{getFieldDecorator('inventory', {})(<Input />)}</div>
          },
        },
        {
          title: '虚拟库存', dataIndex: 'virtualInventory', key: 'virtualInventory', width: '14%',
          render(text, record, index) {
            return <div>{getFieldDecorator('virtualInventory', {})(<Input />)}</div>
          },
        },
        {
          title: 'barcode', dataIndex: 'skuCode', key: 'skuCode', width: '14%',
          render(text, record, index) {
            return <div>{getFieldDecorator('skuCode', {})(<Input />)}</div>
          },
        },
        {
          title: '重量(KG)', dataIndex: 'weight', key: 'weight', width: '14%',
          render(text, record, index) {
            return <div>{getFieldDecorator('weight', {})(<Input />)}</div>
          },
        },
        {
          title: '操作', key: 'operator',
          render(text, record, index) {
            return <Popconfirm title="确定删除?" onConfirm={p.handleDelete(record.id)}>
            <a href="javascript:void(0)">删除</a>
          </Popconfirm>
          },
        },
      ],
      dataSource: p.state.skuList,
      bordered: false,
      pagination: true,
    };
    return (
      <Modal 
        {...modalProps}
        className={styles.modalStyle}
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
                    {brands && brands.data.map(item => {
                      return <Option key={item.id} value={item.name} title={item.name}>{item.name}</Option>
                    })}
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
            <Col span={7}>
              <FormItem
                label="重量（kg）"
                {...formItemLayout}
              >
                {getFieldDecorator('weight', {
                  rules: [{ required: true, message: '请输入重量' }],
                })(
                  <InputNumber step={0.01} min={0} style={{width: 133.5}} placeholder="请输入重量" />
                )}
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
              {...modalTableProps}
              rowKey={record => record.id}
            />
          </Row>
        </Form>
      </Modal>
    );
    
  }

}

function mapStateToProps(state) {
  const { brands } = state.products;
  return {
    loading: state.loading.models.products,
    brands,
  };
}

ProductsModal = Form.create()(ProductsModal);

export default connect(mapStateToProps)(ProductsModal);
