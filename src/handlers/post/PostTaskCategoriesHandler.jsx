import React, {Component} from 'react';

import TaskCategoryUtils from 'utils/TaskCategoryUtils';

export default class PostTaskCategoriesHandler extends Component {

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  _onSelectCategory(c) {
    this.context.history.pushState(null, `/post/${c}`);
  }

  render() {
    const categories = TaskCategoryUtils.list()
    .filter(c => c !== 'other') // We will add the 'other' category manually.
    .map(c => {
      return (
        <div key={c} className="category" onClick={() => this._onSelectCategory(c)}>
          <div className="category-icon" style={{
            backgroundImage: `url('${TaskCategoryUtils.getImage(c)}')`,
          }} />
          <div className="category-title">
            {TaskCategoryUtils.getName(c)}
          </div>
          <div className="category-examples">
            {TaskCategoryUtils.getExamples(c)} and more!
          </div>
        </div>
      );
    });

    return (
      <div className="post-task-categories-handler container pad-all">
        <h2 className="title">Select your Task Category</h2>
        <div className="category-picker">{categories}</div>
        <div className="other-row">
          <div className="category" onClick={() => this._selectCategory('other')}>
            <div className="other-icon" />
          </div>
        </div>
      </div>
    );
  }
}
