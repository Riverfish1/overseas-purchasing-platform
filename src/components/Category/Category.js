import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Pagination, Input, Button, Row, Col, Select, DatePicker, Form, Icon } from 'antd';
import CategoryModal from './CategoryModal';
import styles from './Category.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

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
        title: '类别名称', dataIndex: 'cateName', key: 'cateName',
      },
      {
        title: '类别代码', dataIndex: 'cateCode', key: 'cateCode',
      },
      {
        title: '服务费率', dataIndex: 'servicesRate', key: 'servicesRate',
      },
      {
        title: '属性名称', dataIndex: 'propName', key: 'propName',
      },
      {
        title: '备注', dataIndex: 'remark', key: 'remark',
      },
    ];

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { dataSource, form } = this.props;
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
                rowKey={record => record.id}
              />
            </Col>
          </Row>
        </Form>
        <CategoryModal
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

Category.PropTypes = {
  dataSource: PropTypes.array.isRequired,
};

Category = Form.create()(Category);

export default connect(mapStateToProps)(Category);
