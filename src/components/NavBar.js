import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import ParseReact from 'parse-react';
import ParseComponent from 'parse-react/class';

export default class NavBar extends ParseComponent {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  observe() {
    return {
      user: ParseReact.currentUser,
    };
  }

  render() {
    let brand = (
      <div onClick={this._goHome.bind(this)}>
        <img style={styles.logo} src={require('../images/logo-nobg-sm.png')}/>
        <span style={styles.title}>Nelper</span>
      </div>
    );
    return (
      <Navbar brand={brand} toggleNavKey={0}>
        <Nav right eventKey={0}>
        { !this.data.user ? [
          this._renderNavItem('Login', '/login', 1),
          this._renderNavItem('Register', '/register', 2),
        ] : [
          this._renderNavItem('Nelp', '/nelp', 3),
          this._renderNavItem('Find Nelp', '/findnelp', 4),
          this._renderNavItem('Profile', '/profile', 5),
        ]}
        </Nav>
      </Navbar>
    );
  }

  _renderNavItem(title, href, key) {
    let active = this.context.router.isActive(href);
    return (
      <NavItem
        className={active ? 'active' : ''}
        key={key}
        eventKey={key}
        onClick={this._onActive.bind(this)}
        href={href}>
        {title}
      </NavItem>
    );
  }

  _onActive(event) {
    // Use the router instead of the normal link behavior.
    event.preventDefault();
    this.context.router.transitionTo(event.target.pathname);
  }

  _goHome() {
    this.context.router.transitionTo('/');
  }
}

const styles = {
  title: {

  },
  logo: {
    height: 48,
    display: 'inline-block',
    marginRight: 16,
  },
};
