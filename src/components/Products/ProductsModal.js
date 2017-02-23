import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Modal, Table, Pagination, Input, Upload, InputNumber, Button, Row, Col, Select, DatePicker, Form, Icon, Popconfirm } from 'antd';
import styles from './Products.less';

const FormItem = Form.Item;
const Option = Select.Option;

let uuid = 1;

class ProductsModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      skuList: [], // sku数据
      previewVisible: false,

    };
  }

  componentWillMount() {
    
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

  handleCancel() {
    this.setState({ previewVisible: false });
  }

  checkImg(rules, values, callback) {
    callback();
  }

  handleDelete(id) {
    const { skuList } = this.state;
    let skuData = skuList.filter(item => id !== item.id);
    this.setState({ skuList: skuData });
  }

  render() {
    let p = this;
    const { form, visible, close, brands, modalValues } = this.props;
    const { previewVisible } = this.state;
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
    const uploadProps = {
      action: '/haierp1/uploadFile/picUpload',
      listType: 'picture-card',
      data(file) {
        return {
          pic: file.name,
        }
      },
      onPreview(file) {
        p.setState({
          previewVisible: true,
          previewImage: file.url || file.thumbUrl,
        })
      },
      onChange({ fileList }) {
        p.setState({ fileList, })
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
      dataSource: (modalValues && modalValues.data && modalValues.data.itemSkus) || [],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.itemCode,
                  rules: [{ message: '请输入商品编码' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.name,
                  rules: [{required: true, message: '请输入商品名称' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.enName,
                  rules: [{ message: '请输入英文名称' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.itemShort,
                  rules: [{ message: '请输入商品简称' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.categoryId,
                  rules: [{requied: true, message: '请选择所属类目' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.brand,
                  rules: [{requied: true, message: '请选择品牌' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.country === 1 ? '美国' : modalValues && modalValues.data && modalValues.data.country === 2 ? '德国' : modalValues && modalValues.data && modalValues.data.country === 3 ? '日本' : '澳洲' ,
                  rules: [{ message: '请选择国家' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.currency === 1 ? '人民币' : '美元',
                  rules: [{ message: '请选择币种' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.idCard === 1 ? '是' : '否' ,
                  rules: [{ message: '请选择是否身份证' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.startDateStr,
                  rules: [{ message: '请输入销售开始时间' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.endDateStr,
                  rules: [{ message: '请输入销售结束时间' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.buySite,
                  rules: [{ message: '请输入采购站点' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.spec,
                  rules: [{ message: '请输入规格' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.model,
                  rules: [{ message: '请输入型号' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.weight,
                  rules: [{ message: '请输入重量' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.unit,
                  rules: [{ message: '请输入单位' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.source,
                  rules: [{ message: '请输入来源' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.contactPerson,
                  rules: [{ message: '请输入联系人' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.origin,
                  rules: [{ message: '请输入产地' }],
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
                  initialValue: modalValues && modalValues.data && modalValues.data.contactTel,
                  rules: [{ message: '请输入联系电话' }],
                })(
                  <Input placeholder="请输入联系电话" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="备注"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 9 }}
                style={{ marginRight: '-20px' }}
              >
                {getFieldDecorator('remark', {
                  initialValue: modalValues && modalValues.data && modalValues.data.remark,
                  rules: [{ message: '请输入备注' }],
                })(
                  <Input type="textarea" placeholder="请输入备注" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem
                label="添加图片"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 9 }}
                style={{ marginRight: '-20px' }}
              >
                {getFieldDecorator('picUrl', { rules: [{ validator: this.checkImg.bind(this) }] })(
                  <div>
                    <Upload {...uploadProps}>
                      <Icon type="plus" className={styles.uploadPlus} />
                      <div className="ant-upload-text">上传图片</div>
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                      <img alt="example" style={{ width: '100%' }} />
                    </Modal>
                  </div>
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
