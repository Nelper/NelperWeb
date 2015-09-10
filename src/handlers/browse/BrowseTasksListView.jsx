import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {FormattedMessage, FormattedRelative} from 'react-intl';

import Dialog from 'components/Dialog';
import NumericInput from 'components/NumericInput';
import TaskPictureSlider from 'components/TaskPictureSlider';
import UserStore from 'stores/UserStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import LocationUtils from 'utils/LocationUtils';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

export default class BrowseTasksListView extends Component {

  static propTypes = {
    tasks: PropTypes.array.isRequired,
    onTaskSelected: PropTypes.func,
    onApply: PropTypes.func,
    onCancelApply: PropTypes.func,
    onLoadMore: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  static defaultProps = {
    onTaskSelected: () => {},
    onApply: () => {},
    onCancelApply: () => {},
    onLoadMore: () => {},
    isLoading: false,
  }

  state = {
    selectedTask: null,
    makeOfferDialogOpened: false,
    makeOfferValue: 0,
    makeOfferTask: null,
  }

  componentDidMount() {
    document.addEventListener('scroll', this._onScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this._onScroll);
  }

  _onScroll = () => {
    if (this.props.isLoading) {
      return;
    }

    const lastEle = this.refs.displayedTasks.lastChild;
    if (this._shouldLoadMore(lastEle, 200)) {
      this.props.onLoadMore();
    }
  }

  _onMakeOfferValueChange(value) {
    this.setState({makeOfferValue: value});
  }

  _shouldLoadMore(ele, offset = 0) {
    const rect = ele.getBoundingClientRect();
    return rect.bottom <= window.innerHeight + offset;
  }

  _taskDetail(task) {
    // If we click the current task we close it else we
    // select it.
    if (task === this.state.selectedTask) {
      this.setState({selectedTask: null});
    } else {
      this.setState({selectedTask: task});
    }

    this.props.onTaskSelected(task);
  }

  _onMakeOffer(task) {
    this.setState({
      makeOfferDialogOpened: true,
      makeOfferValue: task.priceOffered,
      makeOfferTask: task,
    });
  }

  _onMakeOfferCancel() {
    this.setState({
      makeOfferDialogOpened: false,
      makeOfferTask: null,
    });
  }

  _onMakeOfferConfirm() {
    this.props.onApply(this.state.makeOfferTask, this.state.makeOfferValue);
    this.setState({
      makeOfferDialogOpened: false,
      makeOfferTask: null,
    });
  }

  _onCancelOffer(task) {
    this.props.onCancelApply(task);
  }

  render() {
    const {tasks} = this.props;

    const displayedTasks = tasks.map((t) => {
      const distance = UserStore.isLogged() ?
        Math.round(LocationUtils.kilometersBetween(t.location, UserStore.state.user.location)) :
        null;

      return (
        <div key={t.objectId} className={classNames(
          'task',
          {'collapsed': t !== this.state.selectedTask},
        )}>
          <Dialog opened={this.state.makeOfferDialogOpened}>
            <h2>Make an offer</h2>
            <div className="dialog-content">
              <NumericInput value={this.state.makeOfferValue} onChange={::this._onMakeOfferValueChange} />
            </div>
            <div className="btn-group dialog-buttons">
              <button onClick={::this._onMakeOfferCancel}>Cancel</button>
              <button onClick={::this._onMakeOfferConfirm} className="primary">Apply</button>
            </div>
          </Dialog>
          <div className="header" onClick={() => this._taskDetail(t)}>
            <div className="content">
              <div className="user-picture" style={{backgroundImage: `url('${t.user.pictureURL}')`}}>
                <div className="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(t.category)}')`}} />
              </div>
              <div className="title-col">
                <div className="title">
                  {t.title}
                </div>
                <div className="infos">
                  <div className="user-col">
                    <div className="user-name">{t.user.name}</div>
                    <div className="date">
                      <FormattedRelative value={t.createdAt} />
                    </div>
                  </div>
                  <div className="location-col">
                    <div className="city">
                      {t.city || 'N/A'}
                    </div>
                    {
                      distance !== null ?
                      <div className="distance">
                        <FormattedMessage id="nelpcenter.main.awayFrom" values={{
                          distance: distance || 0,
                        }}/>
                      </div> :
                      null
                    }
                  </div>
                  <div className="price">
                    {'$' + t.priceOffered}
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse-icon" />
          </div>
          <div className="detail">
            <div className="desc-col">
              <div className="desc">
                {t.desc}
              </div>
              <div className="btn-group controls">
                {
                  t.application && t.application.state === NELP_TASK_APPLICATION_STATE.PENDING ?
                  <button className="primary" onClick={() => this._onCancelOffer(t)}>
                    Cancel offer
                  </button> :
                  <button className="primary" onClick={() => this._onMakeOffer(t)}>
                    Make an offer
                  </button>
                }
                <button className="secondary">View Profile</button>
              </div>
            </div>
            {
              t.pictures && t.pictures.length > 0 ?
              <div className="task-pictures">
                <TaskPictureSlider task={t} />
              </div> :
              null
            }
          </div>
        </div>
      );
    });

    return (
      <div className="nelp-task-list-view" ref="displayedTasks">
        {
          !displayedTasks.length ?
          <div className="no-task"><FormattedMessage id="browse.noTask"/></div> :
          displayedTasks
        }
      </div>
    );
  }
}
