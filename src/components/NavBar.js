import React, {Component} from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';

export default class NavBar extends Component {

  state = {
    collapsed: true,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  render() {
    let menuItems = !this.props.user ? [
      this._renderNavItem('Nelp', '/nelp', 10),
      this._renderNavItem('Find Nelp', '/findnelp', 20),
      this._renderNavItem('About', '/about', 40),
      this._renderNavItem('Login', '/login', 30),
    ] : [
      this._renderNavItem('Nelp', '/nelp', 10),
      this._renderNavItem('Find Nelp', '/findnelp', 20),
      this._renderNavItem('Profile', '/profile', 30),
      this._renderNavItem('About', '/about', 40),
    ];

    return (
      <header className="navbar" role="banner">
        <div className="navbar-wrapper">
          <div className="menu-bar">
            <Link to="/">
              <div className="logo">
                <div className="logo-bg">
                  <img src={require('images/logo-nobg-sm.png')}/>
                </div>
                <span className="title">Nelper</span>
              </div>
            </Link>
            <div className="navbar-menu-button" onClick={this._toggleMenu.bind(this)}>MENU</div>
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

  _renderNavItem(title, href, key) {
    let active = this.context.router.isActive(href);
    return (
      <li
        className={'nav-link' + (active ? ' active' : '')}
        key={key}>
        <Link to={href} onClick={::this._onActive}>
          {title}
        </Link>
      </li>
    );
  }

  _toggleMenu() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  _onActive() {
    setTimeout(() => {
      if(!this.state.collapsed) {
        this.setState({
          collapsed: true,
        });
      }
    }, 200);
  }
}
