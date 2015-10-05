import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class Icon extends Component {

  static propTypes = {
    svg: PropTypes.string.isRequired,
    size: PropTypes.number,
    className: PropTypes.string,
  }

  render() {
    const {className, ...others} = this.props;
    return (
      <i
        {...others}
        svg={null}
        className={classNames('icon-component', className)}
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
