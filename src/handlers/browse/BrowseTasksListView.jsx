import React, {Component, PropTypes} from 'react';
import Slider from 'react-slick';
import classNames from 'classnames';
import moment from 'moment';

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

    const lastEle = this.refs.displayedTasks.getDOMNode().lastChild;
    if (this._shouldLoadMore(lastEle, 200)) {
      this.props.onLoadMore();
    }
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

  _apply(task) {
    this.props.onApply(task);
  }

  _cancelApplication(task) {
    this.props.onCancelApply(task);
  }

  render() {
    const {tasks} = this.props;

    const displayedTasks = tasks.map((t) => {
      const distance = UserStore.isLogged() ?
        Math.round(LocationUtils.kilometersBetween(t.location, UserStore.state.user.location)) :
        null;

      const pictures = t.pictures && t.pictures.map((p, i) => {
        return (
          <div className="task-picture" style={{backgroundImage: `url('${p.url}')`}} key={i} />
        );
      });

      return (
        <div key={t.objectId} className={classNames(
          'task',
          {'collapsed': t !== this.state.selectedTask},
        )}>
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
                    <div className="user-name">By {t.user.name}</div>
                    <div className="date">
                      Created {moment(t.createdAt).fromNow()}
                    </div>
                  </div>
                  <div className="location-col">
                    <div className="city">
                      {t.city || 'N/A'}
                    </div>
                    {
                      distance !== null ?
                      <div className="distance">
                        {distance} km away from you
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
                  <button className="warning" onClick={() => this._cancelApplication(t)}>
                    ???
                  </button> :
                  <button className="primary" onClick={() => this._apply(t)}>
                    Make an offer
                  </button>
                }
                <button className="secondary">View Profile</button>
              </div>
            </div>
            {
              t.pictures && t.pictures.length > 0 ?
              <div className="task-pictures">
                <Slider
                  dots={true}
                  infinite={false}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  arrows={true}
                >
                  {pictures}
                </Slider>
              </div> :
              null
            }
          </div>
        </div>
      );
    });

    return (
      <div className="nelp-task-list-view" ref="displayedTasks">
        {displayedTasks}
      </div>
    );
  }
}
