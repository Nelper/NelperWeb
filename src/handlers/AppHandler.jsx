import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {IntlProvider} from 'react-intl';
import connectToStores from 'alt/utils/connectToStores';
import classNames from 'classnames';

import UserStore from 'stores/UserStore';
import UserActions from 'actions/UserActions';
import NavBar from 'components/NavBar';
import Breadcrumbs from 'components/Breadcrumbs';

@connectToStores
export default class AppHandler extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    routes: PropTypes.array.isRequired,
    locale: PropTypes.string.isRequired,
    formats: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
  }

  static getStores() {
    return [UserStore];
  }

  static getPropsFromStores() {
    return UserStore.getState();
  }

  componentDidMount() {
    // If the user is logged in update its info from the server.
    if (this.props.user.logged) {
      UserActions.update();
    }
  }

  render() {
    const {
      children,
      user,
      locale,
      messages,
      formats,
    } = this.props;

    const [lang] = locale.split('-');
    const showNavBar = !children || !children.type.showNavBar || children.type.showNavBar();
    return (
      <IntlProvider locale={locale} messages={messages} formats={formats}>
        <div style={{height: '100%'}} className={'lang-' + lang}>
          {
            showNavBar ?
            <NavBar user={user} /> :
            null
          }
          <div className={classNames('main-app-content', {'has-navbar': showNavBar})}>
            <div className="container">
              <Breadcrumbs branch={this.props.routes} />
            </div>
            {children}
          </div>
        </div>
      </IntlProvider>
    );
  }
}
