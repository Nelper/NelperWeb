import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import classNames from 'classnames';

import styles from './Card.scss';

@cssModules(styles, {allowMultiple: true})
export class Card extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  render() {
    const {className, ...others} = this.props;
    return (
      <div {...others} className={className} styleName="card">
        {this.props.children}
        <div styleName="hover"/>
      </div>
    );
  }
}

@cssModules(styles, {allowMultiple: true})
export class CardImageHeader extends Component {

  static propTypes = {
    children: PropTypes.node,
    styleName: PropTypes.string,
  };

  render() {
    const {styleName, ...others} = this.props;
    return (
      <div {...others} styleName={classNames('header', styleName)}>
        {this.props.children}
      </div>
    );
  }
}

@cssModules(styles, {allowMultiple: true})
export class CardContent extends Component {

  static propTypes = {
    children: PropTypes.node,
    styleName: PropTypes.string,
  };

  render() {
    const {styleName, ...others} = this.props;
    return (
      <div {...others} styleName={classNames('content', styleName)}>
        {this.props.children}
      </div>
    );
  }
}
