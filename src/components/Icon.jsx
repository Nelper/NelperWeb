import React, {Component, PropTypes} from 'react';

export default class Icon extends Component {

  static propTypes = {
    svg: PropTypes.string.isRequired,
    size: PropTypes.number,
  }

  render() {
    return (
      <i {...this.props}
        svg={null}
        style={{
          display: 'block',
          width: this.props.size,
          height: this.props.size,
        }}
        dangerouslySetInnerHTML={{__html: this.props.svg}}>
      </i>
    );
  }
}
