import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedRelative} from 'react-intl';
import IntlUtils from 'utils/IntlUtils';

import {Card, CardImageHeader, CardContent} from 'components/Card';
import PriceTag from 'components/PriceTag';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';

import styles from './TaskCardView.scss';

@cssModules(styles)
class TaskCardView extends Component {

  static propTypes = {
    task: PropTypes.object,
    onClick: PropTypes.func,
  };

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
    let text;
    if (this.props.task.state === 'ACCEPTED') {
      switch (this.props.task.completionState) {
      case 'PAYMENT_SENT':
        icon = require('images/status/payment-sent.png');
        text = <FormattedMessage id="nelpcenter.myTasks.paymentSent"/>;
        break;
      case 'COMPLETED':
        icon = require('images/status/payment-released.png');
        text = <FormattedMessage id="nelpcenter.myTasks.paymentReleased"/>;
        break;
      case 'PAYMENT_REQUESTED':
        icon = require('images/status/payment-request.png');
        text = <FormattedMessage id="nelpcenter.myTasks.paymentRequested"/>;
        break;
      case 'ACCEPTED':
      default:
        icon = require('images/icons/accepted.png');
        text = <FormattedMessage id="nelpcenter.myTasks.nelperAccepted"/>;
        break;
      }
    } else if (this.props.task.state === 'COMPLETED') {
      icon = require('images/icons/accepted.png');
      text = <FormattedMessage id="nelpcenter.myTasks.completed"/>;
    } else {
      icon = require('images/icons/applicants.png');
      text = (
        <FormattedMessage id="nelpcenter.common.nelperCount" values={{
          num: this.props.task.applications.pendingCount,
        }}/>
      );
    }

    return (
      <div className={styles.status}>
        <div className={styles['status-icon']} style={{backgroundImage: `url('${icon}')`}} />
        <div className={styles.applicants}>
          {text}
        </div>
      </div>
    );
  }

  _renderStatusSection2() {
    const {task} = this.props;
    if (task.state === 'COMPLETED') {
      return null;
    }
    let icon = require('images/icons/calendar.png');
    let text = (
      <FormattedMessage id="common.postedRelative" values={{
        formattedAgo: <FormattedRelative value={task.createdAt}>{IntlUtils.lower}</FormattedRelative>,
      }}/>
    );
    if (task.state === 'ACCEPTED') {
      switch (task.completionState) {
      case 'COMPLETED':
        icon = require('images/status/give-feedback.png');
        text = <FormattedMessage id="nelpcenter.myTasks.feedback"/>;
        break;
      case 'PAYMENT_SENT':
        text = (
          <FormattedMessage id="nelpcenter.myTasks.sentRelative" values={{
            formattedAgo: <FormattedRelative value={task.acceptedApplication.acceptedAt}>{IntlUtils.lower}</FormattedRelative>,
          }}/>
        );
        break;
      case 'PAYMENT_REQUESTED':
        text = (
          <FormattedMessage id="nelpcenter.myTasks.requestedRelative" values={{
            formattedAgo: <FormattedRelative value={task.acceptedApplication.acceptedAt}>{IntlUtils.lower}</FormattedRelative>,
          }}/>
        );
        break;
      case 'ACCEPTED':
      default:
        text = (
          <FormattedMessage id="nelpcenter.myTasks.acceptedRelative" values={{
            formattedAgo: <FormattedRelative value={task.acceptedApplication.acceptedAt}>{IntlUtils.lower}</FormattedRelative>,
          }}/>
        );
        break;
      }
    }
    return (
      <div className={styles['calendar-row']}>
        <div className={styles['calendar-icon']} style={{backgroundImage: `url('${icon}')`}} />
        <div>
          {text}
        </div>
      </div>
    );
  }

  render() {
    const {task, onClick} = this.props;
    return (
      <Card
        className={styles['task-card-view']}
        onClick={onClick}>
        <CardImageHeader className="header">
          <div className={styles['image-overlay']} style={this._getTaskImageStyles(task)} />
          <div className={styles.category}>
            {
              task.isNew ?
              <div className={styles['is-new']}>
                <div className={styles['is-new-icon']} />
              </div> :
              null
            }
            <div className={styles['category-icon']} style={{backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`}} />
          </div>
        </CardImageHeader>
        <CardContent className={styles.content}>
          <div className={styles.title}>
            {task.title}
          </div>
          <div className={styles['applicants-row']}>
            {this._renderStatus()}
            <PriceTag price={task.priceOffered} />
          </div>
          {this._renderStatusSection2()}
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
        state,
        completionState,
        createdAt,
        category,
        priceOffered,
        pictures {
          url,
        },
        acceptedApplication {
          acceptedAt,
        },
        applications {
          hasNew,
          pendingCount,
        },
      }
    `,
  },
});
