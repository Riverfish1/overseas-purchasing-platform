import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Table, Button, Row, Col } from 'antd';
import CategoryModal from './CategoryModal';
import styles from './Category.less';

class Category extends Component {

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
      this.props.dispatch({
        type: 'products/queryItemList',
        payload: {
          ...filedsValue,
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
    const columns = [
      {
        title: '类别名称', dataIndex: 'name', key: 'name',
      },
      {
        title: '类别代码', dataIndex: 'cateCode', key: 'cateCode',
      },
      {
        title: '服务费率', dataIndex: 'servicesRate', key: 'servicesRate',
      },
      {
        title: '最近修改', dataIndex: 'gmtModify', key: 'gmtModify',
      },
      {
        title: '备注', dataIndex: 'remark', key: 'remark',
      },
    ];

    const { cateList = {} } = this.props;
    return (
      <div className={styles.normal}>
        <Row>
          <Col className={styles.operBtn}>
            <Button type="primary" size="large" onClick={this.showModal.bind(this)}>添加</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columns}
              dataSource={cateList.data}
              bordered
              size="large"
              rowKey={record => record.id}
              pagination={{ total: cateList.totalCount, pageSize: 10 }}
            />
          </Col>
        </Row>
        <CategoryModal
          visible={this.state.modalVisible}
          close={this.closeModal.bind(this)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { cateList } = state.products;
  return {
    loading: state.loading.models.products,
    cateList,
  };
}

Category.PropTypes = {
  cateList: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(Category);
