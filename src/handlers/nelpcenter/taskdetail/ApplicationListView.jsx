import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import {Rating, Icon, PriceTag} from 'components/index';

import styles from './ApplicationListView.scss';

@cssModules(styles)
class ApplicationListView extends Component {

  static propTypes = {
    applications: PropTypes.array.isRequired,
    onAccept: PropTypes.func,
    onDeny: PropTypes.func,
    onRestore: PropTypes.func,
    onViewProfile: PropTypes.func,
  }

  static defaultProps = {
    onAccept: () => {},
    onDeny: () => {},
    onRestore: () => {},
    onViewProfile: () => {},
  }

  _onAccept(application) {
    this.props.onAccept(application);
  }

  _onDeny(application) {
    this.props.onDeny(application);
  }

  _onRestore(application) {
    this.props.onRestore(application);
  }

  _onViewProfile(application) {
    this.props.onViewProfile(application);
  }

  _renderSamePriceIcon(application) {
    if (!application.price || application.price === application.task.priceOffered) {
      return <Icon styleName="price-even" svg={require('images/icons/check.svg')} />;
    } else if (application.price < application.task.priceOffered) {
      return <Icon styleName="price-down" svg={require('images/icons/arrow.svg')} />;
    }
    return <Icon styleName="price-up" svg={require('images/icons/arrow.svg')} />;
  }

  render() {
    const {applications} = this.props;
    const displayedApplications = !applications.length ?
      <div styleName="no-applications">
        <FormattedMessage id="nelpcenter.common.noApplication" />
      </div> :
      applications.map(a => {
        return (
          <div key={a.id} styleName="application">
            <div styleName="user-profile" onClick={() => this._onViewProfile(a)}>
              <div styleName="user-picture"
                style={{backgroundImage: `url('${a.user.pictureURL}')`}}
              >
                <div styleName="user-picture-overlay">
                  <div styleName="view-profile-icon" />
                  <div styleName="view-profile-text">View Profile</div>
                </div>
              </div>
              <div>
                <div styleName="user-info-name">{a.user.name}</div>
                <Rating rating={a.user.rating} number={a.user.tasksCompleted} dark small />
              </div>
            </div>
            <div styleName="list-price-offered">
              <PriceTag price={a.price} />
              {this._renderSamePriceIcon(a)}
            </div>
            {
              a.state === 'PENDING' ?
              <div styleName="actions" className="btn-group">
                <div styleName="btn-accept" onClick={() => this._onAccept(a)} />
                <div styleName="btn-deny" onClick={() => this._onDeny(a)} />
              </div> :
              <div styleName="actions" className="btn-group">
                <div styleName="btn-restore" onClick={() => this._onRestore(a)} />
              </div>
            }
          </div>
        );
      });

    return (
      <div styleName="application-list-view">
        {displayedApplications}
      </div>
    );
  }
}

export default Relay.createContainer(ApplicationListView, {
  fragments: {
    applications: () => Relay.QL`
      fragment on Application @relay(plural: true) {
        id,
        price,
        state,
        user {
          name,
          pictureURL,
          rating,
          tasksCompleted,
        },
        task {
          priceOffered,
        },
      }
    `,
  },
});
