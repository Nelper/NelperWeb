import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import ParseReact from 'parse-react';
import ParseComponent from 'parse-react/class';

export default class NavBar extends ParseComponent {

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  state = {
    selected: '/',
  }

  observe() {
    return {
      user: ParseReact.currentUser,
    };
  }

  render() {
    return (
      <Navbar brand='Nelper' toggleNavKey={0}>
        <Nav right eventKey={0}>
        { !this.data.user ? [
          <NavItem eventKey={1} href='#/login'>Login</NavItem>,
          <NavItem eventKey={2} href='#/register'>Register</NavItem>,
        ] : [
          <NavItem eventKey={1} href='#/nelp'>Nelp</NavItem>,
        ]}
        </Nav>
      </Navbar>
    );
  }

  _onActive(route) {
    this.context.router.transitionTo(route);
  }
}
