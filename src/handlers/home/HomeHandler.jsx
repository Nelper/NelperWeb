import React, {Component} from 'react';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

export default class HomeHandler extends Component {

  render() {
    return (
      <div className="home-handler">
        <section className="section-1">
          <div className="container section-1-container">
            <img className="section-1-logo" src={require('images/logo-round.png')} />
            <h1 className="section-1-title">
              <FormattedMessage id="home.topSectionTitle" />
            </h1>
            <p className="section-1-desc">
              <FormattedMessage id="home.topSectionDesc" />
            </p>
          </div>
        </section>
        <section className="section-2">
          <div className="container section-2-container">
            <div className="section-2-item">
              <h3 className="section-2-title">
                <FormattedMessage id="home.browseTitle" />
              </h3>
              <img className="section-2-icon" src={require('images/home/browse-tasks.png')} />
              <p className="section-2-desc">
                <FormattedMessage id="home.browseDesc" />
              </p>
            </div>
            <div className="section-2-item">
              <h3 className="section-2-title">
                <FormattedMessage id="home.nelpcenterTitle" />
              </h3>
              <img className="section-2-icon" src={require('images/home/nelp-center.png')} />
              <p className="section-2-desc">
                <FormattedMessage id="home.nelpcenterDesc" />
              </p>
            </div>
            <div className="section-2-item">
              <h3 className="section-2-title">
                <FormattedMessage id="home.postTitle" />
              </h3>
              <img className="section-2-icon" src={require('images/home/post-task.png')} />
              <p className="section-2-desc">
                <FormattedMessage id="home.postDesc" />
              </p>
            </div>
          </div>
        </section>
        <section className="section-3">
          <div className="container section-3-container">
            <div className="section-3-col-1">
              <h1 className="section-3-title">
                <FormattedMessage id="home.getCompletedTitle" />
              </h1>
              <p className="section-3-desc">
                <FormattedHTMLMessage id="home.getCompletedDesc" />
              </p>
            </div>
            <div className="section-3-col-2">
              <button className="section-3-btn border-btn inverse">
                <FormattedMessage id="home.getStarted" />
              </button>
            </div>
          </div>
        </section>
        <section className="section-4">
          <div className="container section-4-container">
            <h1>
              <FormattedMessage id="home.becomeNelperTitle" />
            </h1>
            <p>
              <FormattedMessage id="home.becomeNelperDesc" />
            </p>
          </div>
        </section>
      </div>
    );
  }
}
