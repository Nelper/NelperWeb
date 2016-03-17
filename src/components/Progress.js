import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class Progress extends Component {

  static propTypes = {
    small: PropTypes.bool,
    inverse: PropTypes.bool,
  };

  static defaultProps = {
    small: false,
    inverse: false,
  };

  render() {
    return (
      <div className={classNames(
        'progress',
        {'small': this.props.small},
        {'inverse': this.props.inverse},
      )}>
        <div className="bubble-container">
          <div className="bubble" />
        </div>
        <div className="bubble-container">
          <div className="bubble" />
        </div>
        <div className="bubble-container">
          <div className="bubble" />
        </div>
      </div>
    );
  }
}
