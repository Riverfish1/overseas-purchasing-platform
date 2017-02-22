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
        title: '是否推荐', dataIndex: 'name', key: '1',
      },
      {
        title: '是否促销', dataIndex: 'itemCode', key: '2',
      },
      {
        title: '销售类别', dataIndex: 'productsImage', key: '3',
      },
      {
        title: 'SKU编号', dataIndex: 'brand', key: '4',
      },
      {
        title: '商品类型', dataIndex: 'saleType', key: '5',
      },
      {
        title: 'SKU主图', dataIndex: 'categoryId', key: '6',
      },
      {
        title: '简称', dataIndex: 'purchaseDest', key: '7',
      },
      {
        title: '全称', dataIndex: 'startDateStr', key: '8',
      },
      {
        title: '英文名称', dataIndex: 'endDateStr', key: '9',
      },
      {
        title: '商品颜色', dataIndex: 'name', key: '10',
      },
      {
        title: '商品尺寸', dataIndex: 'itemCode', key: '11',
      },
      {
        title: '品牌', dataIndex: 'productsImage', key: '12',
      },
      {
        title: '条码', dataIndex: 'brand', key: '13',
      },
      {
        title: '允许销售', dataIndex: 'saleType', key: '14',
      },
      {
        title: '可售库存', dataIndex: 'categoryId', key: '15',
      },
      {
        title: 'ERP锁定库存', dataIndex: 'purchaseDest', key: '16',
      },
      {
        title: '第三方平台锁定', dataIndex: 'startDateStr', key: '17',
      },
      {
        title: '实际库存（包含在途库存）', dataIndex: 'endDateStr', key: '18',
      },
      {
        title: '成本价', dataIndex: 'startDateStr', key: '19',
      },
      {
        title: '预估运费（人民币）', dataIndex: 'endDateStr', key: '20',
      },
      {
        title: '销售价（人民币）', dataIndex: 'name', key: '21',
      },
      {
        title: '商品重量', dataIndex: 'itemCode', key: '22',
      },
      {
        title: '单位', dataIndex: 'productsImage', key: '23',
      },
      {
        title: '产地', dataIndex: 'brand', key: '24',
      },
      {
        title: '商品来源', dataIndex: 'saleType', key: '25',
      },
      {
        title: '联系人', dataIndex: 'categoryId', key: '26',
      },
      {
        title: '联系人电话', dataIndex: 'purchaseDest', key: '27',
      },
      {
        title: '商品代码', dataIndex: 'startDateStr', key: '28',
      },
      {
        title: '联系人备注', dataIndex: 'endDateStr', key: '29',
      },
      {
        title: '商品备注', dataIndex: 'endDateStr', key: '30',
      },
    ];

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { skuList, form } = this.props;
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
                dataSource={skuList.data}
                bordered
                size="large"
                scroll={{ x: 2400 }}
                rowKey={record => record.id}
                pagination={{ total: skuList.totalCount, pageSize: 10 }}
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
  const { skuList } = state.products;
  return {
    loading: state.loading.models.products,
    skuList,
  };
}

Sku.PropTypes = {
  dataSource: PropTypes.array.isRequired,
};

Sku = Form.create()(Sku);

export default connect(mapStateToProps)(Sku);
