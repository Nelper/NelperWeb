import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import connectToStores from 'alt/utils/connectToStores';
import {FormattedMessage} from 'react-intl';

import AppActions from 'actions/AppActions';
import UserStore from 'stores/UserStore';
import AppStore from 'stores/AppStore';

@connectToStores
export default class NelpCenterHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
    children: PropTypes.node,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [UserStore];
  }

  static getPropsFromStores() {
    return UserStore.getState();
  }

  componentDidMount() {
    if (!this.props.children) {
      this._redirectToSelectedTab();
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.children) {
      this._redirectToSelectedTab();
    } else {
      const path = newProps.location.pathname;
      if (path !== `/center/${AppStore.state.nelpCenter.selectedTab}`) {
        if (path === '/center/applications') {
          // Prevents dispatch error... TODO: Find a better way to handle this.
          setTimeout(() => AppActions.setSelectedTab('applications'), 0);
        } else {
          setTimeout(() => AppActions.setSelectedTab('tasks'), 0);
        }
      }
    }
  }

  _redirectToSelectedTab() {
    this.context.router.replaceWith(`/center/${AppStore.state.nelpCenter.selectedTab}`);
  }

  render() {
    return (
      <div className="nelp-center-handler container">
        <div className="header-panel">
          <div className="tab-bar">
            <div className="tabs">
              <Link className="tab" to="/center/tasks">
                <FormattedMessage id="nelpcenter.main.myTasks"/>
              </Link>
              <Link className="tab" to="/center/applications">
                <FormattedMessage id="nelpcenter.main.myApplications"/>
              </Link>
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
