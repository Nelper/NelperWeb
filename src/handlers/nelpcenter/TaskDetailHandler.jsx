import React, {Component, PropTypes} from 'react';
import Slider from 'react-slick';
import invariant from 'invariant';
import connectToStores from 'alt/utils/connectToStores';
import moment from 'moment';

import ApplicationListView from './ApplicationListView';
import Progress from 'components/Progress';
import Dialog from 'components/Dialog';
import Editable from 'components/Editable';
import TaskActions from 'actions/TaskActions';
import TaskStore from 'stores/TaskStore';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

@connectToStores
export default class TaskDetailHandler extends Component {

  static propTypes = {
    task: PropTypes.object,
    isLoading: PropTypes.bool,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [TaskStore];
  }

  static getPropsFromStores(props) {
    const tasks = TaskStore.getState().myTasks;
    const task = tasks.find(t => t.objectId === props.params.id);
    if (!task) {
      TaskActions.refreshMyTasks();
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

  state = {
    confirmDeleteOpened: false,
  };

  constructor(props) {
    super(props);
    this._setTaskAsViewed = false;
  }

  componentDidMount() {
    this._markTaskViewed();
  }

  componentDidUpdate() {
    this._markTaskViewed();
  }

  _onDescChanged(desc) {
    const task = this.props.task;
    task.desc = desc;
    TaskActions.updateTask(task);
  }

  _onAccept(application) {
    TaskActions.acceptApplication(application);
  }

  _onDeny(application) {
    TaskActions.denyApplication(application);
  }

  _onViewProfile() {

  }

  _cancelDelete() {
    this.setState({confirmDeleteOpened: false});
  }

  _confirmDelete() {
    TaskActions.deleteTask(this.props.task);
    this.context.router.goBack();
  }

  _delete() {
    this.setState({confirmDeleteOpened: true});
  }

  _back() {
    this.context.router.goBack();
  }

  _markTaskViewed() {
    if (!this._setTaskAsViewed && this.props.task) {
      this._setTaskAsViewed = true;
      // Have to do this to avoid fireing this action in the
      // middle of a dispatch.
      setTimeout(() => {
        TaskActions.setTaskViewed(this.props.task);
      }, 0);
    }
  }

  render() {
    const {task, isLoading} = this.props;
    const {confirmDeleteOpened} = this.state;
    if (isLoading) {
      return (
        <div className="container pad-all center">
          <Progress />
        </div>
      );
    }

    const pictures = task.pictures && task.pictures.map((p, i) => {
      return (
        <div className="task-picture" style={{backgroundImage: `url('${p.url}')`}} key={i} />
      );
    });

    const pendingApplications = task.applications
      .filter(a => a.state === NELP_TASK_APPLICATION_STATE.PENDING);

    const deniedApplications = task.applications
      .filter(a => a.state === NELP_TASK_APPLICATION_STATE.DENIED);

    return (
      <div className="find-nelp-detail-handler">
        <Dialog opened={confirmDeleteOpened}>
          <h1>Warning!</h1>
          <p className="dialog-text">Are your sure you want to delete the task '{task.title}'?</p>
          <div className="btn-group dialog-buttons">
            <button onClick={::this._cancelDelete}>
              Cancel
            </button>
            <button onClick={::this._confirmDelete} className="primary">
              Delete
            </button>
          </div>
        </Dialog>
        <div className="detail-container container pad-all">
          <button className="back" onClick={::this._back}>Back</button>
          <h2>{task.title}</h2>
          <div className="detail-row description">
            <Editable
              multiline={true}
              onEditDone={::this._onDescChanged}
              initialValue={task.desc}
              />
          </div>
          <div className="other-info-container">
            <div className="other-info-col">
              <div className="detail-row">
                <div className="detail-icon applicants-count" />
                <div className="detail-text">{task.applications.length} applicants</div>
              </div>
              <div className="detail-row">
                <div className="detail-icon price-offered" />
                <div className="detail-text">${task.priceOffered} offered</div>
              </div>
              <div className="detail-row">
                <div className="detail-icon calendar" />
                <div className="detail-text">
                  <div>Posted {moment(task.createdAt).fromNow()}</div>
                  <div>Expires {moment(task.createdAt).add(15, 'days').fromNow()}</div>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-icon location" />
                <div className="detail-text">
                  {task.city}
                </div>
              </div>
            </div>
            <div className="image-col">
              {
                pictures.length ?
                <Slider
                  dots={true}
                  infinite={false}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  arrows={true}>
                  {pictures}
                </Slider> :
                null
              }
            </div>
          </div>
          <div className="btn-group">
            <button className="warning" onClick={::this._delete}>Delete</button>
          </div>
        </div>
        <div className="container pad-all">
          <h2>Applicants</h2>
          <ApplicationListView
            applications={pendingApplications}
            onAccept={::this._onAccept}
            onDeny={::this._onDeny}
            onViewProfile={::this._onViewProfile}
          />
        {
          deniedApplications.length ?
          <div>
            <h2>Denied Applicants</h2>
            <ApplicationListView
              applications={deniedApplications}
              onViewProfile={::this._onViewProfile}
            />
          </div> :
          null
        }
        </div>
      </div>
    );
  }
}
