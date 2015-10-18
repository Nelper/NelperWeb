import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {Link} from 'react-router';
import {FormattedMessage, FormattedRelative, FormattedNumber} from 'react-intl';
import {VelocityTransitionGroup} from 'velocity-react';

import MakeOfferDialogView from './MakeOfferDialogView';
import TaskPictureSlider from 'components/TaskPictureSlider';
import ApplyForTaskMutation from 'actions/ApplyForTaskMutation';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import LocationUtils from 'utils/LocationUtils';
import IntlUtils from 'utils/IntlUtils';

import styles from './BrowseTasksListView.scss';

@cssModules(styles)
class BrowseTasksListView extends Component {

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    relay: PropTypes.object.isRequired,
    browse: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    onTaskSelected: PropTypes.func,
  }

  static defaultProps = {
    onTaskSelected: () => {},
    onMakeOffer: () => {},
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
    window.addEventListener('scroll', this._onScroll);
  }

  componentWillReceiveProps(newProps) {
    const newFilters = newProps.filters;
    const filters = this.props.filters;
    const location = newFilters.location ? {
      latitude: newFilters.location.latitude,
      longitude: newFilters.location.longitude,
    } : null;
    if (newFilters.sort !== filters.sort ||
        newFilters.minPrice !== filters.minPrice ||
        newFilters.maxDistance !== filters.maxDistance ||
        newFilters.categories !== filters.categories) {
      this.props.relay.setVariables({
        sort: newProps.filters.sort,
        location: location,
        maxDistance: newProps.filters.maxDistance,
        minPrice: newProps.filters.minPrice,
        categories: newProps.filters.categories,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll);
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
    if (!this.props.me.logged) {
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

  render() {
    const {tasks} = this.props.browse;

    const displayedTasks = tasks.edges.map((edge) => {
      const t = edge.node;
      const distance = this.props.me.logged ?
        Math.round(LocationUtils.kilometersBetween(t.location, this.props.me.privateData.location)) :
        null;

      const selected = this.state.selectedTask && t.id === this.state.selectedTask.id;

      return (
        <div key={t.objectId} styleName={selected ? 'task' : 'task-collapsed'}>
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
                      <FormattedMessage id="common.postedRelative" values={{
                        formattedAgo: <FormattedRelative value={t.createdAt}>{IntlUtils.lower}</FormattedRelative>,
                      }}/>
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
          <VelocityTransitionGroup component="div" enter="slideDown" leave="slideUp">
          {
            selected ?
            <div styleName="detail">
              <div styleName="profile-btn-row">
                <div styleName="profile-btn-container">
                  <Link to={`/browse/profile/${t.user.id}`}>
                    <button className="secondary border-btn">
                      <FormattedMessage id="browse.profile" />
                    </button>
                  </Link>
                </div>
                <div styleName="desc-col">
                  <div styleName="desc">
                    <div styleName="desc-text">
                      {t.desc}
                    </div>
                    <div styleName="controls" className="btn-group">
                      {
                        t.application && t.application.state === 'PENDING' ?
                        <Link to={`/center/applications/detail/${t.application.id}`}>
                          <button className="primary">
                            <FormattedMessage id="browse.viewApplication" />
                          </button>
                        </Link> :
                        <button className="primary" onClick={() => this._onMakeOffer(t)}>
                          <FormattedMessage id="browse.makeOffer" />
                        </button>
                      }
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
            </div> :
            null
          }
          </VelocityTransitionGroup>
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
    sort: null,
    maxDistance: null,
    minPrice: null,
    categories: null,
    location: null,
  },
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        logged,
        privateData {
          location {
            latitude,
            longitude,
          }
        }
      }
    `,
    browse: () => Relay.QL`
      fragment on Browse {
        tasks(first: $first, sort: $sort, location: $location, maxDistance: $maxDistance, minPrice: $minPrice, categories: $categories) {
          pageInfo {
            hasNextPage,
          },
          edges {
            node {
              id,
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
                id,
                name,
                pictureURL,
              },
      				pictures {
                url,
              },
              application {
                id,
                state,
              },
              ${ApplyForTaskMutation.getFragment('task')},
            }
          }
        }
      }
    `,
  },
});
