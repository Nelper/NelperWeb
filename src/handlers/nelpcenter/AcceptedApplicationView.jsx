import React, {Component, PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';

export default class TaskCardView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className="accepted-application-view">
        <h2>
          <FormattedMessage id="nelpcenter.taskDetail.nelperAccepted"/>
        </h2>
      </div>
    );
  }
}
