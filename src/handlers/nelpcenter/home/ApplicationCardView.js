import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import ApplicantStatusView from '../common/ApplicantStatusView';
import {Card, CardImageHeader, CardContent} from 'components/Card';
import PriceTag from 'components/PriceTag';
import UserStore from 'stores/UserStore';
import LocationUtils from 'utils/LocationUtils';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';

import styles from './ApplicationCardView.scss';

@cssModules(styles)
class ApplicationCardView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
    onClick: PropTypes.func,
  };

  render() {
    const {application, onClick} = this.props;
    const task = application.task;

    const distance = Math.round(LocationUtils.kilometersBetween(task.location, UserStore.state.user.location));

    return (
      <Card
        styleName="application-card-view"
        onClick={onClick}>
        <CardImageHeader>
          <div className={styles['image-overlay']} style={{
            backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`,
          }} />
            <div className={styles.category}>
            <div className={styles['category-icon']} style={{backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`}} />
          </div>
        </CardImageHeader>
        <CardContent className={styles.content}>
          <div className={styles.title}>
            {task.title}
          </div>
          <div className={styles['status-row']}>
            <div className={styles.status}>
              <ApplicantStatusView application={application} />
            </div>
            <PriceTag price={application.price} />
          </div>
          <div className={styles.location}>
            <div className={styles['location-icon']} />
            <div className={styles['location-text']}>
              <div>{task.city}</div>
              <div className={styles.distance}>
                <FormattedMessage id="nelpcenter.main.awayFrom" values={{
                  distance: distance,
                }}/>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default Relay.createContainer(ApplicationCardView, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        createdAt,
        state,
        price,
        task {
          title,
          category,
          city,
          location {
            latitude,
            longitude,
          }
        },
        ${ApplicantStatusView.getFragment('application')},
      }
    `,
  },
});
