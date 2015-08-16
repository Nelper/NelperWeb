import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';

export default class NavBar extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    collapsed: true,
  }

  _onToggleMenu() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  _onActive() {
    setTimeout(() => {
      if (!this.state.collapsed) {
        this.setState({
          collapsed: true,
        });
      }
    }, 200);
  }

  _renderNavItem(title, href, key) {
    const active = this.context.router.isActive(href);
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

  render() {
    const menuItems = !this.props.user.logged ? [
      this._renderNavItem('How it works', '/howitworks', 40),
      this._renderNavItem('Nelp', '/browse', 10),
      this._renderNavItem('Find Nelp', '/post', 20),
      this._renderNavItem('Login', '/login', 30),
    ] : [
      this._renderNavItem('How it works', '/howitworks', 40),
      this._renderNavItem('Browse', '/browse', 10),
      this._renderNavItem('Post', '/post', 20),
      this._renderNavItem('Nelp Center', '/center', 50),
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
