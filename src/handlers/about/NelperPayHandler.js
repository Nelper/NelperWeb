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
          <div styleName="section" className="container">
            <h2>
              <FormattedMessage id="nelperPay.section1Title" />
            </h2>
            <h3>
              <FormattedMessage id="nelperPay.section1Subtitle" />
            </h3>
            <div>
              <FormattedHTMLMessage id="nelperPay.section1Desc" />
            </div>
          </div>
        </section>
        <section styleName="section-light">
          <div styleName="section" className="container">
            <h2>
              <FormattedMessage id="nelperPay.section2Title" />
            </h2>
            <h3>
              <FormattedMessage id="nelperPay.section2Subtitle" />
            </h3>
            <div>
              <FormattedHTMLMessage id="nelperPay.section2Desc" />
            </div>
          </div>
        </section>
        <section styleName="section-dark">
          <div styleName="section" className="container">
            <h2>
              <FormattedMessage id="nelperPay.section3Title" />
            </h2>
            <h3>
              <FormattedMessage id="nelperPay.section3Subtitle" />
            </h3>
            <div>
              <FormattedHTMLMessage id="nelperPay.section3Desc" />
            </div>
          </div>
        </section>
        <section styleName="section-light">
          <div styleName="section" className="container">
            <h2>
              <FormattedMessage id="nelperPay.section4Title" />
            </h2>
            <h3>
              <FormattedMessage id="nelperPay.section4Subtitle" />
            </h3>
            <div>
              <FormattedHTMLMessage id="nelperPay.section4Desc" />
            </div>
          </div>
        </section>
        <section styleName="section-dark">
          <div styleName="section" className="container">
            <h2>
              <FormattedMessage id="nelperPay.section5Title" />
            </h2>
            <h3>
              <FormattedMessage id="nelperPay.section5Subtitle" />
            </h3>
            <div>
              <FormattedHTMLMessage id="nelperPay.section5Desc" />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
