import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

import SkuModal from './SkuModal';
import styles from './Sku.less';

moment.locale('zh-cn');

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
        startDateStr: filedsValue.startDateStr.format('YYYY-MM-DD'),
        endDateStr: filedsValue.endDateStr.format('YYYY-MM-DD'),
      };
      console.log(values);
      this.props.dispatch({
        type: 'products/queryItemList',
        payload: {
          ...values,
        },
      });
    });
  }

  showModal() {
    this.setState({
      modalVisible: true,
    });
  }

  closeModal(modalVisible) {
    this.setState({
      modalVisible,
    });
  }

  render() {
    const p = this;
    const columns = [
      { title: 'SKU条码', dataIndex: 'skuCode', key: 'skuCode' },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName' },
      { title: '品牌', dataIndex: 'brand', key: 'brand' },
      { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName' },
      { title: '尺寸', dataIndex: 'scale', key: 'scale' },
      { title: '颜色', dataIndex: 'color', key: 'color' },
      { title: '虚拟库存', dataIndex: 'virtualInventory', key: 'virtualInventory' },
      { title: '重量', dataIndex: 'weight', key: 'weight' },
      { title: '修改时间', dataIndex: 'gmtModify', key: 'gmtModify' },
      { title: '操作', dataIndex: 'oper', key: 'oper' },
    ];

    const { skuList, currentPage } = this.props;

    const paginationProps = {
      total: skuList && skuList.totalCount,
      pageSize: 10,
      current: currentPage,
      onChange(pageIndex) {
        p.props.dispatch({
          type: 'sku/querySkuList',
          payload: { pageIndex },
        });
      },
    };

    return (
      <div className={styles.normal}>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Row>
            <Col className={styles.operBtn}>
              <Button type="primary" size="large" onClick={this.showModal.bind(this)}>添加</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table
                columns={columns}
                dataSource={skuList.data}
                bordered
                rowKey={record => record.id}
                pagination={paginationProps}
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

function mapStateToProps({ sku }) {
  const { skuList, currentPage } = sku;
  return {
    // loading: state.loading.models.products,
    skuList,
    currentPage,
  };
}

Sku.PropTypes = {
  dataSource: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(Form.create()(Sku));
