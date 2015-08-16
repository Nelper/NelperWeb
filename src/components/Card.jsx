import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export class Card extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  }

  render() {
    const {className, ...others} = this.props;
    return (
      <div {...others} className={classNames('card-component', className)}>
        {this.props.children}
        <div className="card-hover"/>
      </div>
    );
  }
}

export class CardImageHeader extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  }

  render() {
    const {className, ...others} = this.props;
    return (
      <div {...others} className={classNames('card-image-header', className)}>
        {this.props.children}
      </div>
    );
  }
}

export class CardContent extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  }

  render() {
    const {className, ...others} = this.props;
    return (
      <div {...others} className={classNames('card-content', className)}>
        {this.props.children}
      </div>
    );
  }
}
