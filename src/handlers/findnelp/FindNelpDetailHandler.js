import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import Progress from 'components/Progress';
import FindNelpActions from 'actions/FindNelpActions';
import FindNelpStore from 'stores/FindNelpStore';

@connectToStores
export default class FindNelpDetailHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [FindNelpStore];
  }

  static getPropsFromStores(props) {
    let tasks = FindNelpStore.getState().myTasks;
    let task = tasks.find(t => t.objectId === props.params.id);
    if(!task) {
      FindNelpActions.refreshMyTasks();
      return {
        isLoading: true,
        task: null,
      };
    }
    return {
      isLoading: false,
      task: task,
    };
  }

  render() {
    let {task, isLoading} = this.props;
    if(true || isLoading) {
      return (
        <div className="container pad-all center">
          <Progress />
        </div>
      );
    }
    return (
      <div className="container pad-all">
        <h2>{task.title}</h2>
        <p>{task.desc}</p>
        <div className="btn-group">
          <button onClick={this._back.bind(this)}>Back</button>
        </div>
      </div>
    );
  }

  _back() {
    this.context.router.goBack();
  }
}
