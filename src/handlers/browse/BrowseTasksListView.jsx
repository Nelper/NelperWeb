import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage, FormattedRelative, FormattedNumber} from 'react-intl';

import MakeOfferDialogView from './MakeOfferDialogView';
import TaskPictureSlider from 'components/TaskPictureSlider';
import UserStore from 'stores/UserStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import LocationUtils from 'utils/LocationUtils';
import {NELP_TASK_APPLICATION_STATE} from 'utils/constants';

import styles from './BrowseTasksListView.scss';

@cssModules(styles)
class BrowseTasksListView extends Component {

  static propTypes = {
    relay: PropTypes.object.isRequired,
    browse: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    onTaskSelected: PropTypes.func,
    onMakeOffer: PropTypes.func,
    onCancelApply: PropTypes.func,
    onLoadMore: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  static defaultProps = {
    onTaskSelected: () => {},
    onMakeOffer: () => {},
    onCancelApply: () => {},
    onLoadMore: () => {},
    isLoading: false,
  }

  state = {
    selectedTask: null,
    makeOfferDialogOpened: false,
    makeOfferTask: null,
  }

  componentDidMount() {
    document.addEventListener('scroll', this._onScroll);
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
    this.props.onMakeOffer(this.state.makeOfferTask, value);
    this.setState({
      makeOfferDialogOpened: false,
      makeOfferTask: null,
    });
  }

  _onCancelOffer(task) {
    this.props.onCancelApply(task);
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
    first: 10,
    sort: UserStore.getState().user.location ? 'DISTANCE' : 'DATE',
    location: {
      latitude: UserStore.getState().user.location.latitude,
      longitude: UserStore.getState().user.location.longitude,
    },
    maxDistance: null,
    minPrice: null,
    categories: null,
  },
  fragments: {
    browse: () => Relay.QL`
      fragment on Browse {
        tasks(first: $first, sort: $sort, location: $location, maxDistance: $maxDistance, minPrice: $minPrice, categories: $categories) {
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
            }
          }
        }
      }
    `,
  },
});
