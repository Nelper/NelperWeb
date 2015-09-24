import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {FormattedMessage, FormattedRelative, FormattedNumber} from 'react-intl';

import {Card, CardImageHeader, CardContent} from 'components/Card';
import UserStore from 'stores/UserStore';
import LocationUtils from 'utils/LocationUtils';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import IntlUtils from 'utils/IntlUtils';

class ApplicationCardView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
    onClick: PropTypes.func,
  }

  render() {
    const {application, onClick} = this.props;
    const task = application.task;

    const distance = Math.round(LocationUtils.kilometersBetween(task.location, UserStore.state.user.location));
    const statusIcon = application.state === 'ACCEPTED' ?
      require('images/icons/accepted.png') :
      require('images/icons/state-pending.png');

    const statusText = application.state === 'ACCEPTED' ?
      <FormattedMessage id="common.accepted"/> :
      <FormattedMessage id="common.pending"/>;

    return (
      <Card
        className="application-card-view"
        onClick={onClick}>
        <CardImageHeader>
          <div className="image-overlay" style={{
            backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`,
          }} />
          <div className="category">
            <div className="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`}} />
          </div>
        </CardImageHeader>
        <CardContent>
          <div className="title">
            {task.title}
          </div>
          <div className="info-row status">
            <div className="status-icon" style={{backgroundImage: `url('${statusIcon}')`}} />
            <div className="text status-text">{statusText}</div>
            <div className="price">
              <FormattedNumber value={application.price} format="priceTag" />
            </div>
          </div>
          <div className="info-row calendar">
            <div className="calendar-icon" />
            <div className="text calendar-text">
              <FormattedMessage id="nelpcenter.main.applied" values={{
                moment: <FormattedRelative value={application.createdAt}>{IntlUtils.lower}</FormattedRelative>,
              }}/>
            </div>
          </div>
          <div className="info-row location">
            <div className="location-icon" />
            <div className="text location-text">
              <div className="city">{task.city}</div>
              <div className="distance">
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
      }
    `,
  },
});
