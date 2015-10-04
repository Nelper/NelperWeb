import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {IntlProvider} from 'react-intl';
import classNames from 'classnames';

import UserStore from 'stores/UserStore';
import NavBar from 'components/NavBar';
import Breadcrumbs from 'components/Breadcrumbs';

class AppHandler extends Component {

  static propTypes = {
    relay: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    routes: PropTypes.array.isRequired,
    locale: PropTypes.string.isRequired,
    formats: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
  }

  _logged = UserStore.isLogged()

  _userStoreListener = () => {
    // TODO: find a way to update the user.
    if (this._logged !== UserStore.isLogged()) {
      window.location.reload();
    }
  }

  componentDidMount() {
    UserStore.listen(this._userStoreListener);
  }

  componentWillUnmount() {
    UserStore.unlisten(this._userStoreListener);
  }

  render() {
    const {
      children,
      me,
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
            <NavBar user={me} /> :
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

export default Relay.createContainer(AppHandler, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        id,
        logged,
        name,
        pictureURL,
      }
    `,
  },
});
