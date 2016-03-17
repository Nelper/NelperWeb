import React, {Component} from 'react';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import TaskCategoryUtils from 'utils/TaskCategoryUtils';

import styles from './PostTaskCategoriesHandler.scss';

@cssModules(styles)
export default class PostTaskCategoriesHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  _onSelectCategory(c) {
    this.context.router.pushState(null, `/post/${c}`);
  }

  render() {
    const categories = TaskCategoryUtils.list()
    .filter(c => c !== 'other') // We will add the 'other' category manually.
    .map(c => {
      return (
        <div key={c} styleName="category" onClick={() => this._onSelectCategory(c)}>
          <div styleName="category-icon" style={{
            backgroundImage: `url('${TaskCategoryUtils.getImage(c)}')`,
          }} />
          <div styleName="category-title">
            <FormattedMessage id={`categories.${c}.name`} />
          </div>
          <div styleName="category-examples">
            <FormattedMessage id={`categories.${c}.examples`} />
          </div>
        </div>
      );
    });

    return (
      <div styleName="module" className="container pad-all">
        <h2 styleName="title"><FormattedMessage id="post.selectCategory" /></h2>
        <div styleName="category-picker">{categories}</div>
        <div styleName="other-row">
          <div styleName="category" onClick={() => this._onSelectCategory('other')}>
            <div styleName="other-icon" style={{
              backgroundImage: `url('${TaskCategoryUtils.getImage('other')}')`,
            }} />
          </div>
        </div>
      </div>
    );
  }
}
