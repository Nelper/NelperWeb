import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';

import Progress from './Progress';

import styles from './ProgressButton.scss';

@cssModules(styles)
export default class ProgressButton extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    inverse: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    loading: false,
    inverse: true,
  };

  _onClick(event) {
    if (this.props.onClick && !this.props.loading) {
      this.props.onClick(event);
    }
  }

  render() {
    const {
      children,
      inverse,
      onClick,
      ...others,
    } = this.props;
    return (
      <button {...others} styleName="button" onClick={::this._onClick}>
        <div styleName={this.props.loading ? 'loading-visible' : 'loading'}>
          <Progress inverse={inverse} small />
        </div>
        <div style={{visibility: this.props.loading ? 'hidden' : 'visible'}}>
          {children}
        </div>
      </button>
    );
  }
}
