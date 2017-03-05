import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Popconfirm } from 'antd';
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

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'products/queryBrands',
      payload: {},
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, filedsValue) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'products/querySkuList',
        payload: {
          ...filedsValue,
        },
      });
    });
  }

  handleDelete(id) {
    this.props.dispatch({
      type: 'sku/deleteSku',
      payload: { id },
    });
  }

  updateModal(id) {
    this.setState({
      modalVisible: true,
    }, () => {
      this.props.dispatch({
        type: 'sku/querySku',
        payload: { id },
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
    }, () => {
      this.props.dispatch({
        type: 'sku/saveSku',
        payload: {},
      });
    });
  }

  render() {
    const p = this;
    const { skuList = {}, currentPage, skuData, brands = [] } = this.props;
    const columns = [
      { title: 'SKU条码', dataIndex: 'skuCode', key: 'skuCode' },
      { title: '商品名称', dataIndex: 'itemName', key: 'itemName' },
      { title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        render(text) {
          let brand = '';
          brands.forEach((item) => {
            if (item.id.toString() === text) {
              brand = item.name;
            }
          });
          return <span>{brand}</span>;
        },
      },
      { title: '所属分类', dataIndex: 'categoryName', key: 'categoryName' },
      { title: '尺寸', dataIndex: 'scale', key: 'scale' },
      { title: '颜色', dataIndex: 'color', key: 'color' },
      { title: '虚拟库存', dataIndex: 'virtualInventory', key: 'virtualInventory' },
      { title: '重量', dataIndex: 'weight', key: 'weight' },
      { title: '修改时间', dataIndex: 'gmtModify', key: 'gmtModify' },
      {
        title: '操作',
        dataIndex: 'oper',
        key: 'oper',
        render(text, record) {
          return (
            <div>
              <a href="javascript:void(0)" style={{ marginRight: 10 }} onClick={p.updateModal.bind(p, record.id)}>修改</a>
              <Popconfirm title="确定删除此类目？" onConfirm={p.handleDelete.bind(p, record.id)}>
                <a href="javascript:void(0)" >删除</a>
              </Popconfirm>
            </div>);
        },
      },
    ];

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
          modalValues={skuData}
          brands={brands}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { skuList, skuData, currentPage } = state.sku;
  const { brands } = state.products;
  return {
    // loading: state.loading.models.sku,
    skuList,
    skuData,
    currentPage,
    brands,
  };
}

Sku.PropTypes = {
  skuList: PropTypes.object.isRequired,
  skuData: PropTypes.object.isRequired,
  current: PropTypes.number.isRequired,
  brands: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(Form.create()(Sku));
