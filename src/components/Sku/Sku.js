import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Pagination, Input, Button, Row, Col, Select, DatePicker, Form, Icon } from 'antd';
import SkuModal from './SkuModal';
import styles from './Sku.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

class Sku extends Component {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, filedsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...filedsValue,
        'startDateStr': filedsValue['startDateStr'].format('YYYY-MM-DD'),
        'endDateStr': filedsValue['endDateStr'].format('YYYY-MM-DD'),
      };
      console.log(values);
      this.props.dispatch({
        type: 'products/queryItemList',
        payload: {
          ...values
        },
      });
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
    })
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
  }

  render() {

    const columns = [
      {
        title: '序号', dataIndex: 'order', key: 'order',
        render(text, record, index) {
          return index + 1;
        },
      },
      {
        title: '是否推荐', dataIndex: 'name', key: 'name',
      },
      {
        title: '是否促销', dataIndex: 'itemCode', key: 'itemCode',
      },
      {
        title: '销售类别', dataIndex: 'productsImage', key: 'productsImage',
      },
      {
        title: 'SKU编号', dataIndex: 'brand', key: 'brand',
      },
      {
        title: '商品类型', dataIndex: 'saleType', key: 'saleType',
      },
      {
        title: 'SKU主图', dataIndex: 'categoryId', key: 'categoryId',
      },
      {
        title: '简称', dataIndex: 'purchaseDest', key: 'purchaseDest',
      },
      {
        title: '全称', dataIndex: 'startDateStr', key: 'startDateStr',
      },
      {
        title: '英文名称', dataIndex: 'endDateStr', key: 'endDateStr',
      },
      {
        title: '商品颜色', dataIndex: 'name', key: 'name',
      },
      {
        title: '商品尺寸', dataIndex: 'itemCode', key: 'itemCode',
      },
      {
        title: '品牌', dataIndex: 'productsImage', key: 'productsImage',
      },
      {
        title: '条码', dataIndex: 'brand', key: 'brand',
      },
      {
        title: '允许销售', dataIndex: 'saleType', key: 'saleType',
      },
      {
        title: '可售库存', dataIndex: 'categoryId', key: 'categoryId',
      },
      {
        title: 'ERP锁定库存', dataIndex: 'purchaseDest', key: 'purchaseDest',
      },
      {
        title: '第三方平台锁定', dataIndex: 'startDateStr', key: 'startDateStr',
      },
      {
        title: '实际库存（包含在途库存）', dataIndex: 'endDateStr', key: 'endDateStr',
      },
      {
        title: '成本价', dataIndex: 'startDateStr', key: 'startDateStr',
      },
      {
        title: '预估运费（人民币）', dataIndex: 'endDateStr', key: 'endDateStr',
      },
      {
        title: '销售价（人民币）', dataIndex: 'name', key: 'name',
      },
      {
        title: '商品重量', dataIndex: 'itemCode', key: 'itemCode',
      },
      {
        title: '单位', dataIndex: 'productsImage', key: 'productsImage',
      },
      {
        title: '产地', dataIndex: 'brand', key: 'brand',
      },
      {
        title: '商品来源', dataIndex: 'saleType', key: 'saleType',
      },
      {
        title: '联系人', dataIndex: 'categoryId', key: 'categoryId',
      },
      {
        title: '联系人电话', dataIndex: 'purchaseDest', key: 'purchaseDest',
      },
      {
        title: '商品代码', dataIndex: 'startDateStr', key: 'startDateStr',
      },
      {
        title: '联系人备注', dataIndex: 'endDateStr', key: 'endDateStr',
      },
      {
        title: '商品备注', dataIndex: 'endDateStr', key: 'endDateStr',
      },
    ];

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { dataSource, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.normal}>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row className={styles.plus}>
            <Col>
              <Button type="primary" size="large" onClick={this.showModal.bind(this)}>添加</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                size="large"
                scroll={{ x: '800px' }}
                rowKey={record => record.id}
              />
            </Col>
          </Row>
        </Form>
        <SkuModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
        />
      </div>
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

Sku.PropTypes = {
  dataSource: PropTypes.array.isRequired,
};

Sku = Form.create()(Sku);

export default connect(mapStateToProps)(Sku);
