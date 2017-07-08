import React, { Component } from 'react';

class ReportShippingByDay extends Component {
  render() {
    return (
      <div>
        <iframe src={`http://${location.host}/haierp1/bi/ship/selectBiShipReportByGmtCreate`} width="960" height="1280" scrolling="no" />
      </div>
    );
  }
}

export default ReportShippingByDay;
