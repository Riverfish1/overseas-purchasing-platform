/* eslint-disable */
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Input, Table, Row, Col } from 'antd';


class ProductTable extends Component {
	render() {
		return <Table dataSource={dataSource} columns={columns} />;
	}
}

ProductTable.PropTypes = {

};

function mapStateToProps(state) {
	
}

export default connect(mapStateToProps)(ProductTable);
