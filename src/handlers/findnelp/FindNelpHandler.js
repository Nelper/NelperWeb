import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import FindNelpActions from 'actions/FindNelpActions';
import FindNelpStore from 'stores/FindNelpStore';
import NelperCard from 'components/NelperCard';

@connectToStores
export default class FindNelpHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [FindNelpStore];
  }

  static getPropsFromStores() {
    return FindNelpStore.getState();
  }

  componentDidMount() {
    FindNelpActions.refreshMyTasks();
  }

  render() {
    let requests = this.props.myTasks.map((r) => {
      return (
        <NelperCard
          key={r.objectId}
          title={r.title + ' - ' + r.applications.filter(a => a.state === 0).length}
          desc={r.desc}
          onClick={this._taskDetail.bind(this, r)} />
      );
    });
    return (
      <div className="container pad-all">
        <h2>Find Nelp</h2>
        <h3>My Nelp requests</h3>
        <div style={styles.cardRow}>
          <NelperCard
            key={0}
            title="Ask for Nelp"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/VisualEditor_-_Icon_-_Add-item.svg/2000px-VisualEditor_-_Icon_-_Add-item.svg.png"
            style={styles.addCard}
            onClick={this._addNelpTask.bind(this)} />
          {requests}
        </div>
      </div>
    );
  }

  _addNelpTask() {
    this.context.router.transitionTo('/findnelp/add');
  }

  _taskDetail(task) {
    this.context.router.transitionTo(`/findnelp/detail/${task.objectId}`, null, {task});
  }
}

const styles = {
  cardRow: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  addCard: {
    maxWidth: 200,
  },
};
