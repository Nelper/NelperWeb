import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import Icon from './Icon';

export default class IconButton extends Component {

  static propTypes = {
    icon: PropTypes.string,
    className: PropTypes.string,
  }

  render() {
    const {icon, className, ...others} = this.props;

    return (
      <div className={classNames('icon-button-component', className)} {...others}>
        <div className="icon-button-component-bg" />
        <Icon className="icon-button-component-icon" svg={icon}/>
      </div>
    );
  }
}
