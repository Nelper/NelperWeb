import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {FormattedMessage, FormattedRelative} from 'react-intl';
import IntlUtils from 'utils/IntlUtils';

import {Card, CardImageHeader, CardContent} from 'components/Card';
import PriceTag from 'components/PriceTag';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';

class TaskCardView extends Component {

  static propTypes = {
    task: PropTypes.object,
    onClick: PropTypes.func,
  }

  _getTaskImageStyles(t) {
    const hasImage = t.pictures && t.pictures.length > 0;
    return {
      backgroundImage: hasImage ?
        `url('${t.pictures[0].url}')` :
        `url('${TaskCategoryUtils.getImage(t.category)}')`,
    };
  }

  _renderStatus() {
    let icon;
    if (this.props.task.acceptedApplication) {
      icon = require('images/icons/accepted.png');
    } else {
      icon = require('images/icons/applicants.png');
    }

    return (
      <div className="status-icon" style={{backgroundImage: `url('${icon}')`}} />
    );
  }

  _renderApplicants() {
    return (
      <div className="applicants">
      {
        !this.props.task.acceptedApplication ?
        <FormattedMessage id="nelpcenter.common.nelperCount" values={{
          num: this.props.task.applications.pendingCount,
        }}/> :
        <FormattedMessage id="nelpcenter.myTasks.nelperAccepted"/>
      }
      </div>
    );
  }

  render() {
    const {task, onClick} = this.props;
    return (
      <Card
        className="task-card-view"
        onClick={onClick}>
        <CardImageHeader className="header">
          <div className="image-overlay" style={this._getTaskImageStyles(task)} />
          <div className="category">
            {
              task.isNew ?
              <div className="is-new">
                <div className="is-new-icon" />
              </div> :
              null
            }
            <div className="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`}} />
          </div>
        </CardImageHeader>
        <CardContent className="content">
          <div className="title">
            {task.title}
          </div>
          <div className="applicants-row">
            {this._renderStatus()}
            {this._renderApplicants()}
            <PriceTag price={task.priceOffered} gray />
          </div>
          <div className="calendar-row">
            <div className="calendar-icon" />
            <div>
              <FormattedMessage id="common.postedRelative" values={{
                formattedAgo: <FormattedRelative value={task.createdAt}>{IntlUtils.lower}</FormattedRelative>,
              }}/>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default Relay.createContainer(TaskCardView, {
  fragments: {
    task: () => Relay.QL`
      fragment on Task {
        title,
        createdAt,
        category,
        priceOffered,
        pictures {
          url,
        },
        acceptedApplication {
          id,
        },
        applications {
          hasNew,
          pendingCount,
        },
      }
    `,
  },
});
