import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {Link} from 'react-router';

import SaveGeneralSettingsMutation from 'actions/settings/SaveGeneralSettingsMutation';
import Storage from 'utils/Storage';

import styles from './Footer.scss';

@cssModules(styles)
class Footer extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  _onChangeLanguage(event) {
    Storage.setItem('lang', event.target.value);

    if (this.props.user.privateData) {
      Relay.Store.update(new SaveGeneralSettingsMutation({
        privateData: this.props.user.privateData,
        language: event.target.value,
      }), {
        onSuccess: () => {
          window.location.reload();
        },
      });
    } else {
      window.location.reload();
    }
  }

  render() {
    const lang = this.props.user.privateData ?
      this.props.user.privateData.language : (Storage.getItem('lang') || 'en');

    return (
      <div styleName="footer">
        <div className="container" styleName="footer-container">
          <div styleName="info-col">
            <div styleName="logo-container">
              <img styleName="logo" src={require('images/logo-round.png')} />
              <div styleName="logo-text">Nelper</div>
            </div>
            <p styleName="desc">
              Nelper is an online marketplace for posting and completing tasks.
              With Nelper, find people near you who can complete your tasks
              or earn money completing other people’s tasks.
            </p>
            <div styleName="language">
              <div styleName="language-label">Language:</div>
              <div styleName="language-dropdown">
                <select value={lang} onChange={::this._onChangeLanguage}>
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
                </select>
              </div>
            </div>
          </div>
          <div styleName="discover-col">
            <div styleName="col-header">Discover</div>
            <ul>
              <li>
                <Link to="/howitworks">How It Works</Link>
              </li>
              <li>
                <Link to="/nelperpay">NelperPay</Link>
              </li>
              <li>
                <Link to="/privacy">Safety & Privacy</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </div>
          <div styleName="company-col">
            <div styleName="col-header">Company</div>
            <ul>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/business">Business Inquiries</Link>
              </li>
              <li>
                <Link to="/tou">Terms of Use</Link>
              </li>
              <li>
                <Link to="/policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div styleName="app-col">
            <div styleName="download-app">Download our app!</div>
            <a href="http://www.apple.com/" target="__blank">
              <img styleName="download-app-button" src={require('images/appstore-download.png')} />
            </a>
            <div styleName="follow">Follow us!</div>
            <div styleName="follow-icons">
              <a href="https://www.facebook.com/nelperteam" target="__blank">
                <img styleName="follow-icon" src={require('images/social/fb-white.png')} />
              </a>
              <a href="https://twitter.com/NelperTeam" target="__blank">
                <img styleName="follow-icon" src={require('images/social/twitter-white.png')} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Footer, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        privateData {
          language,
          ${SaveGeneralSettingsMutation.getFragment('privateData')}
        }
      }
    `,
  },
});
