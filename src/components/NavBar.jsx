import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

export default class NavBar extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    collapsed: true,
    insideProfile: false,
    insideDropDown: false,
  }

  _onToggleMenu() {
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

  _renderNavItem(title, href, key) {
    const active = this.context.router.isActive(href);
    return (
      <li
        className={classNames('nav-link', {'active': active})}
        key={key}>
        <Link to={href} onClick={::this._onActive}>
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
          backgroundImage: `url('${this.props.user.pictureURL}')`,
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
          {this._renderNavItem('View Profile', '/profile', 70)}
          {this._renderNavItem('Settings', '/settings', 80)}
          {this._renderNavItem('Logout', '/logout', 90)}
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
      <header className="navbar" role="banner">
        <div className="navbar-wrapper">
          <div className="menu-bar">
            <Link to="/">
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
