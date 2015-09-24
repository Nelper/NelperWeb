import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedRelative, FormattedNumber} from 'react-intl';

import MakeOfferDialogView from './MakeOfferDialogView';
import TaskPictureSlider from 'components/TaskPictureSlider';
import ApplyForTaskMutation from 'actions/ApplyForTaskMutation';
import CancelApplyForTaskMutation from 'actions/CancelApplyForTaskMutation';
import UserStore from 'stores/UserStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import LocationUtils from 'utils/LocationUtils';

import styles from './BrowseTasksListView.scss';

@cssModules(styles)
class BrowseTasksListView extends Component {

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    relay: PropTypes.object.isRequired,
    browse: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    onTaskSelected: PropTypes.func,
  }

  static defaultProps = {
    onTaskSelected: () => {},
    onMakeOffer: () => {},
    isLoading: false,
  }

  state = {
    selectedTask: null,
    makeOfferDialogOpened: false,
    makeOfferTask: null,
  }

  _isLoading = false

  _onScroll = () => {
    if (!this.props.browse.tasks.pageInfo.hasNextPage || this._isLoading) {
      return;
    }
    const lastEle = this.refs.displayedTasks.lastChild;
    if (this._shouldLoadMore(lastEle, 200)) {
      this._isLoading = true;
      this.props.relay.setVariables(
        {first: this.props.relay.variables.first + 20},
        (readyState) => {
          if (readyState.done) {
            this._isLoading = false;
          }
        },
      );
    }
  }

  componentDidMount() {
    document.body.addEventListener('scroll', this._onScroll);
  }

  componentWillReceiveProps(newProps) {
    const newFilters = newProps.filters;
    const filters = this.props.filters;
    if (newFilters.sort !== filters.sort ||
        newFilters.minPrice !== filters.minPrice ||
        newFilters.maxDistance !== filters.maxDistance ||
        newFilters.categories !== filters.categories) {
      this.props.relay.setVariables({
        sort: newProps.filters.sort,
        location: {
          latitude: UserStore.getState().user.location.latitude,
          longitude: UserStore.getState().user.location.longitude,
        },
        maxDistance: newProps.filters.maxDistance,
        minPrice: newProps.filters.minPrice,
        categories: newProps.filters.categories,
      });
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('scroll', this._onScroll);
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
    // Make sure the user is logged to apply on a task.
    if (!UserStore.isLogged()) {
      this.context.history.pushState({nextPathname: '/browse'}, '/login');
      return;
    }

    this.setState({
      makeOfferDialogOpened: true,
      makeOfferTask: task,
    });
  }

  _onMakeOfferCancel() {
    this.setState({
      makeOfferDialogOpened: false,
      makeOfferTask: null,
    });
  }

  _onMakeOfferConfirm(value) {
    Relay.Store.update(
      new ApplyForTaskMutation({
        task: this.state.makeOfferTask,
        price: value,
      })
    );

    this.setState({
      makeOfferDialogOpened: false,
      makeOfferTask: null,
    });
  }

  _onCancelOffer(task) {
    Relay.Store.update(
      new CancelApplyForTaskMutation({
        task,
      })
    );
  }

  render() {
    const {tasks} = this.props.browse;

    const displayedTasks = tasks.edges.map((edge) => {
      const t = edge.node;
      const distance = UserStore.isLogged() ?
        Math.round(LocationUtils.kilometersBetween(t.location, UserStore.state.user.location)) :
        null;

      return (
        <div key={t.objectId} styleName={t === this.state.selectedTask ? 'task' : 'task-collapsed'}>
          <div styleName="header" onClick={() => this._taskDetail(t)}>
            <div styleName="content">
              <div styleName="user-picture" style={{backgroundImage: `url('${t.user.pictureURL}')`}}>
                <div styleName="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(t.category)}')`}} />
              </div>
              <div styleName="title-col">
                <div styleName="title">
                  {t.title}
                </div>
                <div styleName="infos">
                  <div styleName="user-col">
                    <div styleName="user-name">{t.user.name}</div>
                    <div styleName="date">
                      <FormattedRelative value={t.createdAt} />
                    </div>
                  </div>
                  <div styleName="location-col">
                    <div styleName="city">
                      {t.city || 'N/A'}
                    </div>
                    {
                      distance !== null ?
                      <div styleName="distance">
                        <FormattedMessage id="nelpcenter.main.awayFrom" values={{
                          distance: distance || 0,
                        }}/>
                      </div> :
                      null
                    }
                  </div>
                  <div styleName="price">
                    <FormattedNumber value={t.priceOffered} format="priceTag" />
                  </div>
                </div>
              </div>
            </div>
            <div styleName="collapse-icon" />
          </div>
          <div styleName="detail">
            <div styleName="desc-col">
              <div styleName="desc">
                {t.desc}
              </div>
              <div styleName="controls" className="btn-group">
                {
                  t.application && t.application.state === 'PENDING' ?
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
              <div styleName="task-pictures">
                <TaskPictureSlider task={t} />
              </div> :
              null
            }
          </div>
        </div>
      );
    });

    return (
      <div styleName="module" ref="displayedTasks">
        <MakeOfferDialogView
          opened={this.state.makeOfferDialogOpened}
          task={this.state.makeOfferTask}
          onMakeOffer={::this._onMakeOfferConfirm}
          onClose={::this._onMakeOfferCancel}
        />
        {
          !displayedTasks.length ?
          <div styleName="no-task"><FormattedMessage id="browse.noTask"/></div> :
          displayedTasks
        }
      </div>
    );
  }
}

export default Relay.createContainer(BrowseTasksListView, {
  initialVariables: {
    first: 5,
    sort: UserStore.getState().user.location ? 'DISTANCE' : 'DATE',
    maxDistance: null,
    minPrice: null,
    categories: null,
  },
  prepareVariables: (prepareVariables) => {
    // The the user current location.
    const location = UserStore.getState().user.location ?
      {
        latitude: UserStore.getState().user.location.latitude,
        longitude: UserStore.getState().user.location.longitude,
      } :
      null;

    return {
      ...prepareVariables,
      location,
    };
  },
  fragments: {
    browse: () => Relay.QL`
      fragment on Browse {
        tasks(first: $first, sort: $sort, location: $location, maxDistance: $maxDistance, minPrice: $minPrice, categories: $categories) {
          pageInfo {
            hasNextPage,
          },
          edges {
            node {
              createdAt,
              title,
              desc,
              city,
              category,
              priceOffered,
              location {
                latitude,
                longitude,
              },
              user {
                name,
                pictureURL,
              },
      				pictures {
                url,
              },
              application {
                state,
              },
              ${ApplyForTaskMutation.getFragment('task')},
              ${CancelApplyForTaskMutation.getFragment('task')},
            }
          }
        }
      }
    `,
  },
});
