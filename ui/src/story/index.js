import React, { Component } from 'react';
import PropTypes, { any } from 'prop-types';
import _ from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { getLayout, setLayout } from '../repository';
import Section from './section';
import Slicers from './slicers';

export default class Story extends Component {
  static propTypes = {
    description: PropTypes.string,
    slicers: PropTypes.objectOf(any),
    items: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    description: '',
    slicers: {},
    items: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      slicers: this.props.slicers,
      layout: [],
    };
  }

  componentDidMount() {
    getLayout(this.props.id)
      .then((layout) => {
        this.setState({ layout });
      });
  }

  onSlicerChange(args) {
  // update slicer here
    const { dimensionMap, dataObj } = args;
    const slicers = _.cloneDeep(this.state.slicers);

    _.each(dataObj, (val, dim) => {
      if (dimensionMap[dim].toSlicer) {
        _.set(slicers, `${dimensionMap[dim].toSlicer}.value.values`, [val]);
      }
    });

    this.setState({
      slicers,
    });
  }

  onLayoutChange(newLayout) {
    this.setState({ layout: newLayout });
    setLayout(this.props.id, newLayout);
  }

  render() {
    return (
      <div>
        <h1>{this.props.description}</h1>
        <Slicers slicers={this.state.slicers} />
        <ReactGridLayout
          className="layout"
          layout={this.state.layout}
          cols={12}
          rowHeight={30}
          width={1200}
          onDragStop={newLayout => this.onLayoutChange(newLayout)}
          onResizeStop={newLayout => this.onLayoutChange(newLayout)}
        >
          {_.map(this.props.items, section => (
            <div key={section.id}>
              <Section
                onSlicerChange={args => this.onSlicerChange(args)}
                section={section}
                slicers={this.state.slicers}
              />
            </div>
          ))}
        </ReactGridLayout>
      </div>);
  }
}
