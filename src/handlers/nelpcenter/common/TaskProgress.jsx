import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';

import styles from './TaskProgress.scss';

@cssModules(styles, {allowMultiple: true})
export default class TaskProgress extends Component {

  static propTypes = {
    step: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
  }

  render() {
    const {step, steps} = this.props;

    const nodesAndEdges = steps.reduce((prev, cur, index) => {
      const isLast = index === steps.length - 1;
      const isCenterEdge = index === Math.floor((steps.length - 1) / 2);
      prev.push(
        <div key={'node' + index} styleName={classNames('progress-bar-node', {'completed': step >= index})}>
          <span>{index + 1}</span>
          <div styleName={classNames('progress-bar-title', {'completed': step >= index})}>
            {cur.title}
          </div>
        </div>
      );

      if (!isLast) {
        prev.push(
          <div key={'edge' + index} styleName={classNames(
            'progress-bar-edge',
            {'long-edge': isCenterEdge},
            {'pending': step === index},
            {'completed': step > index},
          )} />
        );
      }
      return prev;
    }, []);

    return (
      <div styleName="task-progress-view">
        <div styleName="title-task-completion">
          <FormattedMessage id="nelpcenter.common.completion" />
        </div>
        <div styleName="progress-bar">
          {nodesAndEdges}
        </div>
      </div>
    );
  }
}
