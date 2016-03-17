import React, {Component} from 'react';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {Link} from 'react-router';

import styles from './FAQHandler.scss';

@cssModules(styles)
export default class FAQHandler extends Component {

  render() {
    // Define the faq sections. Will generate the summary and the corresponding
    // detail section. The text will be provided by messages following the ids
    // faq.${sectionId}Title_{childIndex:000} for titles and faq.${sectionId}Desc_{childIndex:000}
    // for the description. The description message can be HTML.
    const sections = [{
      id: 'general',
      childrens: 5,
    }, {
      id: 'poster',
      childrens: 7,
    }, {
      id: 'nelper',
      childrens: 7,
    }, {
      id: 'privacy',
      childrens: 3,
    }, {
      id: 'payment',
      childrens: 6,
    }];

    const summary = sections.map(s => {
      const titles = [];
      for (let i = 0; i < s.childrens; i++) {
        const index = ('0' + i).slice(-2);
        titles.push(
          <li>
            <a href={`#${s.id}_${index}`}>
              <FormattedMessage id={`faq.${s.id}Title_${index}`} />
            </a>
          </li>
        );
      }
      return (
        <div styleName="summary-item">
          <h2 styleName="summary-title"><FormattedMessage id={`faq.${s.id}SectionTitle`} /></h2>
          <ul styleName="summary-childs">
            {titles}
          </ul>
        </div>
      );
    });

    const details = sections.reduce((prev, cur) => {
      for (let i = 0; i < cur.childrens; i++) {
        const index = ('0' + i).slice(-2);
        prev.push(
          <div styleName="detail-item">
            <a id={`${cur.id}_${index}`} className="anchor" />
            <h3 styleName="detail-title">
              <FormattedMessage id={`faq.${cur.id}Title_${index}`} />
            </h3>
            <p styleName="detail-desc">
              <FormattedHTMLMessage id={`faq.${cur.id}Desc_${index}`} />
            </p>
          </div>
        );
      }
      return prev;
    }, []);

    return (
      <div styleName="module" className="container">
        <section styleName="header" className="panel pad-all">
          <h2 styleName="page-title">
            <FormattedMessage id="faq.pageTitle_01" />
          </h2>
          <h2 styleName="page-title">
            <FormattedMessage id="faq.pageTitle_02" values={{
              supportCenter: (
                <Link to="/support">
                  <FormattedMessage id="faq.supportCenter" />
                </Link>
              ),
            }} />
          </h2>
        </section>
        <section styleName="summary" className="panel pad-all">
          {summary}
        </section>
        <section styleName="detail" className="panel pad-all">
          {details}
        </section>
      </div>
    );
  }
}
