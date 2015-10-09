import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import AppActions from 'actions/AppActions';
import AppStore from 'stores/AppStore';

import styles from './NelpCenterHandler.scss';

@cssModules(styles)
export default class NelpCenterHandler extends Component {

  static propTypes = {
    children: PropTypes.node,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
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
    this.context.history.replaceState(null, `/center/${AppStore.state.nelpCenter.selectedTab}`);
  }

  render() {
    return (
      <div styleName="module" className="container">
        <div className="header-panel">
          <div styleName="tab-bar">
            <div styleName="tabs">
              <Link styleName="tab" activeClassName={styles.active} to="/center/tasks">
                <FormattedMessage id="nelpcenter.main.myTasks"/>
              </Link>
              <Link styleName="tab" activeClassName={styles.active} to="/center/applications">
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
