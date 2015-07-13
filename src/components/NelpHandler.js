import React from 'react';
import {Parse} from 'parse';
import ParseComponent from 'parse-react/class';

export default class NelpHandler extends ParseComponent {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  observe() {
    return {
      tasks: (new Parse.Query('Task')),
    };
  }

  render() {
    let tasks = this.data.tasks.map((t) => {
      return (
        <div onClick={this._taskDetail.bind(this, t)}>{t.title} - {t.applications}</div>
      );
    });
    return (
      <div className="container">
        <h2>Nelp</h2>
        <div>
          {tasks}
        </div>
      </div>
    );
  }

  _taskDetail(task) {
    this.context.router.transitionTo(`/nelp/detail/${task.objectId}`, null, {task});
  }
}
