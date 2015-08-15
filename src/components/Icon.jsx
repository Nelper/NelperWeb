import React from 'react';

export default class Icon extends React.Component {

  static propTypes: {
    svg: React.PropTypes.string.isRequired,
  }

  render () {

    return (
      <i {...this.props}
        svg={null}
        style={{display: 'block'}}
        dangerouslySetInnerHTML={{__html: this.props.svg}}>
      </i>
    );
  }
}
