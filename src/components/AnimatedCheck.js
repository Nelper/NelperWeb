import React, {Component} from 'react';
import cssModules from 'react-css-modules';

import styles from './AnimatedCheck.scss';

@cssModules(styles)
export default class AnimatedCheck extends Component {
  render() {
    return (
      <div className="payment-dialog-checkbox active">
        <div className="checkbox-check" />
      </div>
    );
  }
}
