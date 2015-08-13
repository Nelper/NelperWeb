import React, {Component} from 'react';
import classNames from 'classnames';

export class Card extends Component {

  render() {
    let {className, ...others} = this.props;
    return (
      <div {...others} className={classNames('card-component', className)}>
        {this.props.children}
        <div className="card-hover"/>
      </div>
    );
  }
}

export class CardImageHeader extends Component {

  render() {
    let {className, ...others} = this.props;
    return (
      <div {...others} className={classNames('card-image-header', className)}>
        <div className="overlay" />
        {this.props.children}
      </div>
    );
  }
}

export class CardContent extends Component {

  render() {
    let {className, ...others} = this.props;
    return (
      <div {...others} className={classNames('card-content', className)}>
        {this.props.children}
      </div>
    );
  }
}
