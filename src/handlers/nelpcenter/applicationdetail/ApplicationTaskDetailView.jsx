import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedRelative, FormattedNumber} from 'react-intl';

import {MapView, TaskPictureSlider} from 'components/index';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import {LatLng} from 'utils/GoogleMapsUtils';

import styles from './ApplicationTaskDetailView.scss';

@cssModules(styles)
class ApplicationTaskDetailView extends Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
  }

  render() {
    const {application} = this.props;

    const task = application.task;
    const hasPictures = task.pictures && task.pictures.length > 0;
    const accepted = application.state === 'ACCEPTED';

    return (
      <div styleName="module">
        <div styleName="task-info-section" className="panel">
          <div styleName="task-info-title-row">
            <div
              styleName="task-info-category-icon"
              style={{backgroundImage: `url(${TaskCategoryUtils.getImage(task.category)})`}}
            />
            <div styleName="task-info-title">{task.title}</div>
          </div>
          <div styleName="task-info-other-row">
            <div styleName={hasPictures ? 'main-col-has-pictures' : 'main-col'}>
              <div styleName="task-info-desc">
                {task.desc}
              </div>
              {
                accepted ?
                <div>
                  <div styleName="task-info-exact-location">
                    <div styleName="task-info-exact-location-icon" />
                    <div>
                      <div>{task.userPrivate.exactLocation.streetNumber} {task.userPrivate.exactLocation.route}</div>
                      <div>{task.userPrivate.exactLocation.city}, {task.userPrivate.exactLocation.province}</div>
                      <div>{task.userPrivate.exactLocation.postalCode}</div>
                    </div>
                  </div>
                </div> :
                <div>
                  <div styleName="task-info-calendar-row">
                    <div styleName="task-info-calendar">
                      <div styleName="task-info-calendar-icon" />
                      <div>
                        <FormattedMessage id="common.postedRelative" values={{
                          formattedAgo: <FormattedRelative value={task.createdAt} />,
                        }}/>
                      </div>
                    </div>
                    <div styleName="task-info-location">
                      <div styleName="task-info-location-icon" />
                      <div>{task.city}</div>
                    </div>
                  </div>
                  <div styleName="task-info-price-row">
                    <div styleName="task-info-price-text">
                      <FormattedMessage id="nelpcenter.applicationDetail.offering" values={{
                        name: task.user.firstName,
                      }} />
                    </div>
                    <div styleName="task-info-price">
                      <FormattedNumber value={task.priceOffered} format="priceTag" />
                    </div>
                  </div>
                </div>
              }
            </div>
              {
                hasPictures ?
                <div styleName="task-info-image-col">
                  <TaskPictureSlider task={task} />
                </div> :
                null
              }
          </div>
          <div styleName="map-message">
            {
              accepted ?
              <FormattedMessage id="nelpcenter.applicationDetail.locationShown" /> :
              <FormattedMessage id="nelpcenter.applicationDetail.locationWithin" />
            }
          </div>
        </div>
        <div styleName="task-info-map" className="panel">
          <MapView
            initialCenter={new LatLng(accepted ? task.userPrivate.exactLocation.coords : task.location)}
            markers={[{
              key: 1,
              position: new LatLng(accepted ? task.userPrivate.exactLocation.coords : task.location),
            }]}
            shapes={
              !accepted ? [{
                key: 2,
                center: new LatLng(task.location),
                radius: 400,
              }] : []
            } />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(ApplicationTaskDetailView, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        state,
        task {
          createdAt,
          title,
          desc,
          category,
          priceOffered,
          city,
          location {
            latitude,
            longitude,
          },
          pictures {
            url,
          },
          user {
            firstName,
          },
          userPrivate {
            exactLocation {
              streetNumber,
              route,
              city,
              postalCode,
              province,
              coords {
                latitude,
                longitude,
              }
            },
          },
        },
      }
    `,
  },
});
