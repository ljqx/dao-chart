import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Pie from './pie';
import Line from './line';
import Map from './map';
import Spin from './spine';

const chartMapper = {
  pie: Pie,
  line: Line,
  map: Map,
  spin: Spin,
};

export default class extends PureComponent {
  static propTypes = {
    chartType: PropTypes.string.isRequired,
  }

  render() {
    const { chartType, ...others } = this.props;
    const ChartComponent = chartMapper[chartType] || Pie;
    return (<ChartComponent {...others} />);
  }
}