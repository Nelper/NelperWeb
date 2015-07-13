import React from 'react';
import {Parse} from 'parse';
import ParseComponent from 'parse-react/class';

import NelperCard from './NelperCard';

export default class FindNelpHandler extends ParseComponent {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  observe() {
    return {
      requests: (new Parse.Query('Task')).equalTo('user', Parse.User.current()),
    };
  }

  render() {
    let requests = this.data.requests.map((r) => {
      return (
        <NelperCard
          key={r.objectId}
          title={r.title}
          desc={r.desc}
          onClick={this._taskDetail.bind(this, r)} />
      );
    });
    return (
      <div className="container">
        <h2>Find Nelp</h2>
        <h3>My Nelp requests</h3>
        <div style={styles.cardRow}>
          <NelperCard
            key={0}
            title="New Nelp request"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/VisualEditor_-_Icon_-_Add-item.svg/2000px-VisualEditor_-_Icon_-_Add-item.svg.png"
            style={styles.addCard}
            onClick={this._addNelpTask.bind(this)} />
          {requests}
        </div>
        <h3>Recommended Nelpers</h3>
        <div style={styles.cardRow}>
          <NelperCard title="Jean" image="http://static1.squarespace.com/static/546f7219e4b0e2711c68a320/t/54c68230e4b0455a4f9fed46/1422295600616/" />
          <NelperCard title="Marie" image="http://static1.squarespace.com/static/546f7219e4b0e2711c68a320/t/54c68230e4b0455a4f9fed46/1422295600616/" />
          <NelperCard title="Dawg" image="http://static1.squarespace.com/static/546f7219e4b0e2711c68a320/t/54c68230e4b0455a4f9fed46/1422295600616/" />
          <NelperCard title="Jane" image="http://static1.squarespace.com/static/546f7219e4b0e2711c68a320/t/54c68230e4b0455a4f9fed46/1422295600616/" />
          <NelperCard title="Mill" image="http://static1.squarespace.com/static/546f7219e4b0e2711c68a320/t/54c68230e4b0455a4f9fed46/1422295600616/" />
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
