import React, {Component, PropTypes} from 'react';

import {Card, CardImageHeader, CardContent} from 'components/Card';

export default class TaskCardView extends Component {

  static propTypes = {
    application: PropTypes.object,
    onClick: PropTypes.func,
  }

  render() {
    let {application, onClick} = this.props;
    return (
      <Card
        className="task-card-view"
        onClick={onClick}>
        <CardImageHeader />
        <CardContent>
          {application.task.title}
        </CardContent>
      </Card>
    );
  }
}
