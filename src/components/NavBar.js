import React, {Component} from 'react';

export default class NavBar extends Component {

  state = {
    collapsed: true,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  render() {
    return (
      <header className="navbar" role="banner">
        <div className="navbar-wrapper">
          <div className="logo" onClick={this._goHome.bind(this)}>
            <img src={require('images/logo-nobg-sm.png')}/>
            <span>Nelper</span>
          </div>
          <div className="navbar-menu-button" onClick={this._toggleMenu.bind(this)}>MENU</div>
          <nav role="navigation">
            <ul className={'navbar-menu' + (this.state.collapsed ? '' : ' show')}>
              { !this.props.user ? [
                this._renderNavItem('Login', '/login', 1),
                this._renderNavItem('Register', '/register', 2),
              ] : [
                this._renderNavItem('Nelp', '/nelp', 3),
                this._renderNavItem('Find Nelp', '/findnelp', 4),
                this._renderNavItem('Profile', '/profile', 5),
              ]}
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  _toggleMenu() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  _renderNavItem(title, href, key) {
    let active = this.context.router.isActive(href);
    return (
      <li
        className={'nav-link' + (active ? ' active' : '')}
        key={key}
        onClick={this._onActive.bind(this, href)}>
        {title}
      </li>
    );
  }

  _onActive(url) {
    if(!this.state.collapsed) {
      this.setState({
        collapsed: true,
      });
    }
    this.context.router.transitionTo(url);
  }

  _goHome() {
    this.context.router.transitionTo('/');
  }
}
