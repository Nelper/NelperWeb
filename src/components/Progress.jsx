import React, {Component} from 'react';
import classNames from 'classnames';

export default class Progress extends Component {

  static propTypes = {
    small: React.PropTypes.bool,
  }

  static defaultProps = {
    small: false,
  }

  render() {
    return (
      <div className={classNames('progress', {'small': this.props.small})}>
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
