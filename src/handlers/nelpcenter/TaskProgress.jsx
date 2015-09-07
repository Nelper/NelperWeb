import React, {Component, PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';

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
        <div key={'node' + index} className={classNames('progress-bar-node', {'completed': step >= index})}>
          <span>{index + 1}</span>
          <div className={classNames('progress-bar-title', {'completed': step >= index})}>
            {cur.title}
          </div>
        </div>
      );

      if (!isLast) {
        prev.push(
          <div key={'edge' + index} className={classNames(
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
      <div className="task-progress-view">
        <div className="title-task-completion">
          <FormattedMessage id="nelpcenter.applicationDetail.completion" />
        </div>
        <div className="progress-bar">
          {nodesAndEdges}
        </div>
      </div>
    );
  }
}
