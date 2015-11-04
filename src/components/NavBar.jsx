import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

import UserActions from 'actions/UserActions';
import {isInside} from 'utils/DomUtils';

export default class NavBar extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  state = {
    collapsed: true,
    insideProfile: false,
    insideDropDown: false,
  }

  _documentClickListener = this._onDocumentClick.bind(this)

  componentDidMount() {
    document.addEventListener('click', this._documentClickListener);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._documentClickListener);
  }

  _onDocumentClick(event) {
    if (this.state.collapsed || event.defaultPrevented) {
      return;
    }
    if (isInside(this.refs.navbar, event.target)) {
      return;
    }
    event.stopPropagation();
    this.setState({collapsed: true});
  }

  _onToggleMenu(event) {
    event.preventDefault();
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  _onActive() {
    this.setState({
      collapsed: true,
      insideProfile: false,
      insideDropDown: false,
    });
  }

  _onProfileEnter() {
    this.setState({insideProfile: true});
  }

  _onProfileLeave() {
    this.setState({insideProfile: false});
  }

  _onDropdownEnter() {
    this.setState({insideDropDown: true});
  }

  _onDropdownLeave() {
    this.setState({insideDropDown: false});
  }

  _renderNavItem(title, action, key) {
    let active;
    let onClick;
    let href;
    if (typeof action === 'string') {
      active = this.context.history.isActive(action);
      onClick = this._onActive.bind(this);
      href = action;
    } else {
      active = false;
      onClick = () => {
        this._onActive();
        action();
      };
      href = '/';
    }
    return (
      <li
        className={classNames('nav-link', {'active': active})}
        key={key}>
        <Link to={href} onClick={onClick}>
          {title}
        </Link>
      </li>
    );
  }

  _renderProfileDropdown() {
    return (
      <li
        className="nav-link navbar-profile"
        key="profile"
        onMouseEnter={::this._onProfileEnter}
        onMouseLeave={::this._onProfileLeave}
      >
        <div className="navbar-separator" />
        <div className="navbar-profile-picture" style={{
          backgroundImage: `url('${this.props.user.pictureURL || require('images/user-no-picture.jpg')}')`,
        }} />
        <div className="navbar-profile-icon" />
        <ul
          className={classNames(
            'navbar-dropdown',
            {'opened': this.state.insideProfile || this.state.insideDropDown}
          )}
          onMouseEnter={::this._onDropdownEnter}
          onMouseLeave={::this._onDropdownLeave}
        >
          {this._renderNavItem(<FormattedMessage id="navBar.profile"/>, '/profile', 70)}
          {this._renderNavItem(<FormattedMessage id="navBar.settings"/>, '/settings', 80)}
          {this._renderNavItem(<FormattedMessage id="navBar.logout"/>, () => UserActions.logout(), 90)}
          <div className="navbar-dropdown-separator" key={100} />
          {this._renderNavItem(<FormattedMessage id="navBar.howItWorks"/>, '/howitworks', 110)}
          {this._renderNavItem(<FormattedMessage id="navBar.nelperPay"/>, '/nelperpay', 120)}
          {this._renderNavItem(<FormattedMessage id="navBar.faq"/>, '/faq', 130)}
        </ul>
      </li>
    );
  }

  render() {
    const menuItems = !this.props.user.logged ? [
      this._renderNavItem(<FormattedMessage id="navBar.browse"/>, '/browse', 10),
      this._renderNavItem(<FormattedMessage id="navBar.post"/>, '/post', 20),
      this._renderNavItem(<FormattedMessage id="navBar.login"/>, '/login', 30),
    ] : [
      this._renderNavItem(<FormattedMessage id="navBar.browse"/>, '/browse', 10),
      this._renderNavItem(<FormattedMessage id="navBar.center"/>, '/center', 50),
      this._renderNavItem(<FormattedMessage id="navBar.post"/>, '/post', 20),
      this._renderProfileDropdown(),
    ];

    return (
      <header className="navbar" role="banner" ref="navbar">
        <div className="navbar-wrapper">
          <div className="menu-bar">
            <Link to="/" onClick={::this._onActive}>
              <div className="logo">
                <img src={require('images/logo-round.png')}/>
                <span className="title">Nelper</span>
              </div>
            </Link>
            <div className="navbar-menu-button" onClick={::this._onToggleMenu}>MENU</div>
          </div>
          <nav role="navigation" className={classNames({'collapsed': this.state.collapsed})}>
            <ul className="navbar-menu">
              {menuItems}
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}
