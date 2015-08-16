import React, {Component, PropTypes} from 'react';

export default class Icon extends Component {

  static propTypes = {
    svg: PropTypes.string.isRequired,
  }

  render() {
    return (
      <i {...this.props}
        svg={null}
        style={{display: 'block'}}
        dangerouslySetInnerHTML={{__html: this.props.svg}}>
      </i>
    );
  }
}
