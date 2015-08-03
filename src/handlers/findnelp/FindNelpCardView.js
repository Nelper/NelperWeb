import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import TaskCategoryUtils from 'utils/TaskCategoryUtils';

export default class FindNelpCardView extends Component {

  static propTypes = {
    task: PropTypes.object,
    onClick: PropTypes.func,
  }

  render() {
    let {task, onClick} = this.props;
    TaskCategoryUtils.setRandomCategory(task);
    return (
      <div
          className={classNames('find-nelp-card-view', 'category-bg-' + task.category)}
          onClick={onClick}>
        <div className="card-image" style={{backgroundImage: `url('${this._taskImage(task)}')`}}>
          <div className="image-overlay" />
          <div className="category">
            <div className="icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`}} />
            <div className="name">
              {TaskCategoryUtils.getName(task.category)}
            </div>
          </div>
        </div>
        <div className="card-content">
          <div className="title">
            {task.title}
          </div>
          <div className="desc">
            {task.desc}
          </div>
        </div>
        <div className="card-hover"/>
      </div>
    );
  }

  _taskImage(t) {
    if(!t.pictures || t.pictures.length === 0) {
      return 'http://www.dlink.com/-/media/Images/Products/DSR/500N/2%20DSR500NA1Image%20LSide.png';
    }
    return t.pictures[0].url;
  }
}
