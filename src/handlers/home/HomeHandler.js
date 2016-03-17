import React, {Component} from 'react';
import {Link} from 'react-router';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

import TaskCategoryUtils from 'utils/TaskCategoryUtils';

import styles from './HomeHandler.scss';

@cssModules(styles)
export default class HomeHandler extends Component {

  componentDidMount() {
    window.addEventListener('scroll', this._onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll);
  }

  state = {
    sections: {
      'section-categories': false,
    },
  };

  _onScroll = () => {
    const sections = this.state.sections;
    for (const section in this.refs) {
      if (section.indexOf('section-') >= 0 && sections[section] === false) {
        const node = this.refs[section];
        const rect = node.getBoundingClientRect();
        if (rect.bottom <= window.innerHeight) {
          sections[section] = true;
          this.setState({
            sections: sections,
          });
        }
      }
    }
  };

  _shouldLoadMore(ele, offset = 0) {
    const rect = ele.getBoundingClientRect();
    return rect.bottom <= window.innerHeight + offset;
  }

  render() {
    const {sections} = this.state;

    const categories = TaskCategoryUtils.list()
      .filter(c => c !== 'other')
      .map(c => {
        return (
          <img key={c} styleName="category" src={TaskCategoryUtils.getImage(c)} />
        );
      });

    return (
      <div styleName="module">
        <section styleName="section-1">
          <div className="container" styleName="section-1-container">
            <img styleName="section-1-logo" src={require('images/logo-round.png')} />
            <h1 styleName="section-1-title">
              <FormattedMessage id="home.topSectionTitle" />
            </h1>
            <p styleName="section-1-desc">
              <FormattedMessage id="home.topSectionDesc" />
            </p>
          </div>
        </section>
        <section styleName="section-2" ref="section-2">
          <div className="container" styleName="section-2-container">
            <div styleName="section-2-item">
              <h3 styleName="section-2-title">
                <FormattedMessage id="home.browseTitle" />
              </h3>
              <img styleName="section-2-icon" src={require('images/home/browse-tasks.png')} />
              <p styleName="section-2-desc">
                <FormattedMessage id="home.browseDesc" />
              </p>
            </div>
            <div styleName="section-2-item">
              <h3 styleName="section-2-title">
                <FormattedMessage id="home.nelpcenterTitle" />
              </h3>
              <img styleName="section-2-icon" src={require('images/home/nelp-center.png')} />
              <p styleName="section-2-desc">
                <FormattedMessage id="home.nelpcenterDesc" />
              </p>
            </div>
            <div styleName="section-2-item">
              <h3 styleName="section-2-title">
                <FormattedMessage id="home.postTitle" />
              </h3>
              <img styleName="section-2-icon" src={require('images/home/post-task.png')} />
              <p styleName="section-2-desc">
                <FormattedMessage id="home.postDesc" />
              </p>
            </div>
          </div>
        </section>
        <section styleName="section-3" ref="section-3">
          <div className="container" styleName="section-3-container">
            <div styleName="section-3-col-1">
              <h1>
                <FormattedMessage id="home.getCompletedTitle" />
              </h1>
              <p>
                <FormattedHTMLMessage id="home.getCompletedDesc" />
              </p>
            </div>
            <div styleName="section-3-col-2">
              <Link to="/post">
                <button styleName="section-3-btn" className="border-btn inverse">
                  <FormattedMessage id="home.getStarted" />
                </button>
              </Link>
            </div>
          </div>
        </section>
        <section
          styleName={sections['section-categories'] ? 'section-categories-active' : 'section-categories'}
          ref="section-categories"
        >
          <div styleName="section-categories-container" className="container">
            <h1>
              <FormattedMessage id="home.categoriesTitle" />
            </h1>
            <p>
              <FormattedMessage id="home.categoriesDesc" />
            </p>
            <div styleName="categories">
              {categories}
            </div>
          </div>
        </section>
        <section styleName="section-nelper" ref="section-5">
          <div className="container" styleName="section-nelper-container">
            <h1>
              <FormattedMessage id="home.becomeNelperTitle" />
            </h1>
            <p styleName="nelper-desc">
              <FormattedMessage id="home.becomeNelperDesc" />
            </p>
            <Link to="/browse">
              <button styleName="browse-btn" className="primary">
                <FormattedMessage id="home.browseTasks" />
              </button>
            </Link>
          </div>
        </section>
        <section styleName="section-nelperpay" ref="section-6">
          <div className="container" styleName="section-nelperpay-container">
            <h1>
              <FormattedMessage id="home.nelperpayTitle" />
            </h1>
            <p>
              <FormattedMessage id="home.nelperpayDesc" />
            </p>
            <div styleName="nelperpay-infos">
              <img styleName="nelperpay-logo" src={require('images/icons/nelperpay.png')} />
              <ul styleName="nelperpay-features">
                <li><FormattedMessage id="home.nelperpayFeature1" /></li>
                <li><FormattedMessage id="home.nelperpayFeature2" /></li>
                <li><FormattedHTMLMessage id="home.nelperpayFeature3" /></li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
