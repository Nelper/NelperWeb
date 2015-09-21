import React, {Component} from 'react';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

import styles from './NelperPayHandler.scss';

@cssModules(styles)
export default class NelperPayHandler extends Component {

  render() {
    return (
      <div styleName="module">
        <section styleName="section-light">
          <div styleName="header-section" className="container">
            <h1>
              <FormattedMessage id="nelperPay.headerTitle" />
            </h1>
            <img styleName="nelperpay-icon" src={require('images/icons/nelperpay.png')}/>
            <div styleName="header-text">
              <FormattedHTMLMessage id="nelperPay.headerText" />
            </div>
          </div>
        </section>
        <section styleName="section-dark">
          <div styleName="whatis-section" className="container">
            <h2>
              <FormattedMessage id="nelperPay.whatIsTitle" />
            </h2>
            <div>
              <FormattedMessage id="nelperPay.whatIsText" />
            </div>
          </div>
        </section>
        <section styleName="section-light">
          <div styleName="whatis-section" className="container">
            <h2>
              <FormattedMessage id="nelperPay.whatIsTitle" />
            </h2>
            <div>
              <FormattedMessage id="nelperPay.whatIsText" />
            </div>
          </div>
        </section>
        <section styleName="section-dark">
          <div styleName="whatis-section" className="container">
            <h2>
              <FormattedMessage id="nelperPay.whatIsTitle" />
            </h2>
            <div>
              <FormattedMessage id="nelperPay.whatIsText" />
            </div>
          </div>
        </section>
        <section styleName="section-light">
          <div styleName="whatis-section" className="container">
            <h2>
              <FormattedMessage id="nelperPay.whatIsTitle" />
            </h2>
            <div>
              <FormattedMessage id="nelperPay.whatIsText" />
            </div>
          </div>
        </section>
        <section styleName="section-dark">
          <div styleName="whatis-section" className="container">
            <h2>
              <FormattedMessage id="nelperPay.whatIsTitle" />
            </h2>
            <div>
              <FormattedMessage id="nelperPay.whatIsText" />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
