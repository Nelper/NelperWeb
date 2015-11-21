import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import styles from './FailureView.scss';

@cssModules(styles)
export default class FailureView extends Component {

  static propTypes = {
    onRetry: PropTypes.func,
  };

  render() {
    return (
      <div styleName="failure-view">
        <h3>
          <FormattedMessage id="common.errorTitle" />
        </h3>
        <button onClick={this.props.onRetry}>
          <FormattedMessage id="common.retry" />
        </button>
      </div>
    );
  }
}
