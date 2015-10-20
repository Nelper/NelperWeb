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
      <div className={styles['status-icon']} style={{backgroundImage: `url('${icon}')`}} />
    );
  }

  _renderApplicants() {
    return (
      <div className={styles.applicants}>
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
            {this._renderApplicants()}
            <PriceTag price={task.priceOffered} />
          </div>
          <div className={styles['calendar-row']}>
            <div className={styles['calendar-icon']} />
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
