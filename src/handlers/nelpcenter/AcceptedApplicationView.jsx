import React, {Component, PropTypes} from 'react';

export default class TaskCardView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className="accepted-application-view">
        <h2>Accepted applicant</h2>
      </div>
    );
  }
}
