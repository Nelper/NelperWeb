import React, {Component, PropTypes} from 'react';
import {FormattedDate} from 'react-intl';
import connectToStores from 'alt/utils/connectToStores';
import cssModules from 'react-css-modules';

import {Progress, Rating, PriceTag} from 'components/index';
import ChatDialogView from './ChatDialogView';
import TaskActions from 'actions/TaskActions';
import TaskStore from 'stores/TaskStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';

import styles from './TaskApplicationDetailHandler.scss';

@connectToStores
@cssModules(styles)
export default class TaskApplicationDetailHandler extends Component {

  static propTypes = {
    application: PropTypes.object,
    isLoading: PropTypes.bool,
  }

  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  static getStores() {
    return [TaskStore];
  }

  static getPropsFromStores(props) {
    const tasks = TaskStore.getState().myTasks;
    const task = tasks.find(t => t.objectId === props.params.taskId);
    // If the task isn't in the store load it.
    if (!task) {
      if (__CLIENT__) {
        TaskActions.refreshMyTasks();
      }

      return {
        isLoading: true,
        task: null,
      };
    }

    const application = task.applications.find(a => a.objectId === props.params.applicationId);

    if (__CLIENT__ && !application.user.feedback) {
      TaskActions.refreshApplicantFeedback(application);
    }

    return {
      isLoading: false,
      application,
    };
  }

  state = {
    showChatDialog: false,
  }

  _onOpenChat() {
    this.setState({showChatDialog: true});
  }

  _onCloseChat() {
    this.setState({showChatDialog: false});
  }

  render() {
    const {application, isLoading} = this.props;

    if (isLoading) {
      return (
        <div className="progress-center">
          <Progress />
        </div>
      );
    }

    const user = application.user;

    const skills = user.skills.map(s => {
      return (
        <div styleName="skill" key={s.objectId}>
          {s.title}
        </div>
      );
    });

    const education = user.education.map(e => {
      return (
        <div key={e.objectId}>
          {e.title}
        </div>
      );
    });

    const experience = user.experience.map(e => {
      return (
        <div key={e.objectId}>
          {e.title}
        </div>
      );
    });

    let feedback = null;
    if (user.feedback) {
      if (user.feedback.length) {
        feedback = user.feedback.map(f => {
          return (
            <div styleName="feedback-item" key={f.objectId}>
              <div styleName="feedback-header">
                <div styleName="feedback-category" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(f.task.category)}')`}} />
                <div styleName="feedback-username">{f.poster.name}</div>
              </div>
              <div styleName="feedback-content">
                <div styleName="feedback-rating"><Rating rating={f.rating} dark /></div>
                <div styleName="feedback-text">{f.content}</div>
                <div styleName="feedback-date"><FormattedDate value={f.createdAt} /></div>
              </div>
            </div>
          );
        });
      } else {
        feedback = <div>No feedback yet</div>;
      }
    }

    return (
      <div styleName="module" className="container">
        <ChatDialogView
          user={user}
          opened={this.state.showChatDialog}
          onClose={::this._onCloseChat}
        />
        <div className="header-panel" styleName="header" >
          <div styleName="header-profile">
            <div
              styleName="picture"
              style={{backgroundImage: `url('${user.pictureURL}')`}}
            />
            <div styleName="info-container">
              <div styleName="user-name">
                {user.name}
              </div>
              <Rating rating={user.rating} />
              <div styleName="tasks-completed">8 tasks completed</div>
            </div>
          </div>
          <div styleName="header-asking-for">
            Asking for
            <PriceTag inverse price={application.price} />
          </div>
          <div styleName="chat">
            <div styleName="chat-icon" />
            <button className="border-btn inverse" onClick={::this._onOpenChat}>Open Chat</button>
          </div>
        </div>
        <div styleName="section-row" className="panel pad-all">
          <div styleName="section-title">
            <div styleName="section-icon-about" />
            <div>About</div>
          </div>
          <div styleName="section-content">
            {user.about}
          </div>
        </div>
        <div styleName="section-row" className="panel pad-all">
          <div styleName="section-title">
            <div styleName="section-icon-skills" />
            <div>Skills</div>
          </div>
          <div styleName="section-content">
            <div styleName="skills">
              {skills}
            </div>
          </div>
        </div>
        <div styleName="section-row" className="panel pad-all">
          <div styleName="section-title">
            <div styleName="section-icon-education" />
            <div>Education</div>
          </div>
          <div styleName="section-content">
            <div>
              {education}
            </div>
          </div>
        </div>
        <div styleName="section-row" className="panel pad-all">
          <div styleName="section-title">
            <div styleName="section-icon-work" />
            <div>Work experience</div>
          </div>
          <div styleName="section-content">
            <div>
              {experience}
            </div>
          </div>
        </div>
        <div styleName="section-row" className="panel pad-all">
          <div styleName="section-title">
            <div styleName="section-icon-feedback" />
            <div>Feedback</div>
          </div>
          <div styleName="section-content">
            <div styleName="feedback">
              {feedback}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
