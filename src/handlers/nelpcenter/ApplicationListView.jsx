import React, {Component, PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';

import {Rating, Icon, PriceTag} from 'components/index';

export default class ApplicationListView extends Component {

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
      return <Icon className="price-icon price-even" svg={require('images/icons/check.svg')} />;
    } else if (application.price < application.task.priceOffered) {
      return <Icon className="price-icon price-down" svg={require('images/icons/arrow.svg')} />;
    }
    return <Icon className="price-icon price-up" svg={require('images/icons/arrow.svg')} />;
  }

  render() {
    const applications = !this.props.applications.length ?
      <div className="no-applications">
        <FormattedMessage id="nelpcenter.common.noApplication" />
      </div> :
      this.props.applications.map(a => {
        return (
          <div key={a.id} className="application">
            <div className="user-profile" onClick={() => this._onViewProfile(a)}>
              <div className="user-picture"
                style={{backgroundImage: `url('${a.user.pictureURL}')`}}
              >
                <div className="user-picture-overlay">
                  <div className="view-profile-icon" />
                  <div className="view-profile-text">View Profile</div>
                </div>
              </div>
              <div className="user-info">
                <div className="user-info-name">{a.user.name}</div>
                <Rating rating={a.user.rating} number={a.user.tasksCompleted} dark small />
              </div>
            </div>
            <div className="list-price-offered">
              <PriceTag price={a.price} />
              {this._renderSamePriceIcon(a)}
            </div>
            {
              a.state === 'PENDING' ?
              <div className="btn-group actions">
                <div className="btn-accept" onClick={() => this._onAccept(a)} />
                <div className="btn-deny" onClick={() => this._onDeny(a)} />
              </div> :
              <div className="btn-group actions">
                <div className="btn-restore" onClick={() => this._onRestore(a)} />
              </div>
            }
          </div>
        );
      });

    return (
      <div className="application-list-view">
        {applications}
      </div>
    );
  }
}
