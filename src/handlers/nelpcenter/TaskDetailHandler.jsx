import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {FormattedMessage, FormattedRelative, FormattedNumber} from 'react-intl';
import Slider from 'react-slick';

import ApplicationListView from './ApplicationListView';
import AcceptedApplicationView from './AcceptedTaskView';
import EditPicturesDialogView from './EditPicturesDialogView';
import {Dialog, Icon, Editable} from 'components/index';
import {
  EditTaskDescMutation,
  EditTaskPicturesMutation,
} from 'actions/nelpcenter/index';
import TaskActions from 'actions/TaskActions';
import DateUtils from 'utils/DateUtils';
import IntlUtils from 'utils/IntlUtils';

class TaskDetailHandler extends Component {

  static propTypes = {
    task: PropTypes.object,
    params: PropTypes.object,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  state = {
    confirmDeleteOpened: false,
    editPicturesOpened: false,
    progressHelpDialogOpened: false,
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
    Relay.Store.update(
      new EditTaskDescMutation({
        task: this.props.task,
        desc: desc,
      })
    );
  }

  _onAccept(application) {
    TaskActions.acceptApplication(application);
  }

  _onDeny(application) {
    TaskActions.denyApplication(application);
  }

  _onRestore(application) {
    TaskActions.restoreApplication(application);
  }

  _onViewApplication(application) {
    this.context.history.pushState(null, `/center/tasks/detail/${this.props.params.id}/${application.objectId}`);
  }

  _onCancelDelete() {
    this.setState({confirmDeleteOpened: false});
  }

  _onConfirmDelete() {
    TaskActions.deleteTask(this.props.task);
    this.context.history.goBack();
  }

  _onDelete() {
    this.setState({confirmDeleteOpened: true});
  }

  _onEditPictures() {
    this.setState({editPicturesOpened: true});
  }

  _onEditPicturesClose() {
    this.setState({editPicturesOpened: false});
  }

  _onEditPicturesAdd(picture) {
    const pictures = [...this.props.task.pictures, picture]
      .map(p => ({
        url: p.url,
        name: p.name,
      }));
    Relay.Store.update(
      new EditTaskPicturesMutation({
        task: this.props.task,
        pictures,
      })
    );
  }

  _onEditPicturesDelete(picture) {
    const pictures = this.props.task.pictures
      .filter(p => p !== picture)
      .map(p => ({
        url: p.url,
        name: p.name,
      }));
    Relay.Store.update(
      new EditTaskPicturesMutation({
        task: this.props.task,
        pictures,
      })
    );
  }

  _markTaskViewed() {
    /* if (!this._setTaskAsViewed && this.props.task) {
      this._setTaskAsViewed = true;
      // Have to do this to avoid fireing this action in the
      // middle of a dispatch.
      setTimeout(() => {
        TaskActions.setTaskViewed(this.props.task);
      }, 0);
    }*/
  }

  render() {
    const {task} = this.props;
    const applications = task.applications.edges.map(edge => edge.node);
    const {confirmDeleteOpened, editPicturesOpened} = this.state;

    const pictures = task.pictures && task.pictures.map((p, i) => {
      return (
        <div className="task-picture" style={{backgroundImage: `url('${p.url}')`}} key={i} />
      );
    });

    const pendingApplications = applications.filter(a => a.state === 'PENDING');
    const deniedApplications = applications.filter(a => a.state === 'DENIED');

    const acceptedApplication = task.applications.accepted;
    let applicationsSection;
    if (acceptedApplication) {
      applicationsSection = (
        <AcceptedApplicationView task={task} application={acceptedApplication} />
      );
    } else {
      applicationsSection = (
        <div>
        {
          pendingApplications.length || !deniedApplications.length ?
          <div className="panel">
            <div className="panel-title">
              <div className="pending-icon" />
              <h2>
                <FormattedMessage id="nelpcenter.taskDetail.nelperPending"/>
              </h2>
            </div>
            <ApplicationListView
              applications={pendingApplications}
              onAccept={::this._onAccept}
              onDeny={::this._onDeny}
              onViewProfile={::this._onViewApplication}
            />
          </div> :
          null
        }
        {
          deniedApplications.length ?
          <div className="panel">
            <div className="panel-title">
              <div className="denied-icon" />
              <h2>
                <FormattedMessage id="nelpcenter.taskDetail.nelperDenied"/>
              </h2>
            </div>
            <ApplicationListView
              applications={deniedApplications}
              onRestore={::this._onRestore}
              onViewProfile={::this._onViewProfile}
            />
          </div> :
          null
        }
        </div>
      );
    }

    return (
      <div className="find-nelp-detail-handler container">
        <Dialog opened={confirmDeleteOpened}>
          <h1>
            <FormattedMessage id="common.warning"/>
          </h1>
          <p className="dialog-text">
            <FormattedMessage id="nelpcenter.taskDetail.deleteConfirm" values={{
              title: task.title,
            }}/>
          </p>
          <div className="btn-group dialog-buttons">
            <button onClick={::this._onCancelDelete}>
              <FormattedMessage id="common.cancel"/>
            </button>
            <button onClick={::this._onConfirmDelete} className="primary">
              <FormattedMessage id="common.delete"/>
            </button>
          </div>
        </Dialog>
        <EditPicturesDialogView
          pictures={task.pictures || []}
          opened={editPicturesOpened}
          onClose={::this._onEditPicturesClose}
          onAddPicture={::this._onEditPicturesAdd}
          onDeletePicture={::this._onEditPicturesDelete}
        />
        <div className="detail-container panel pad-all">
          <h2>{task.title}</h2>
          <div className="other-info-container">
            <div className="other-info-col">
              <div className="description">
                <Editable
                  multiline
                  onEditDone={::this._onDescChanged}
                  value={task.desc}
                />
              </div>
              <div className="other-info-split">
                <div className="detail-row">
                  <div className="detail-icon applicants-count" />
                  <div className="detail-text">
                    <FormattedMessage id="nelpcenter.common.nelperCount" values={{
                      num: task.applications.length,
                    }}/>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="price">
                    <FormattedNumber value={task.priceOffered} format="priceTag" />
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-icon calendar" />
                  <div className="detail-text">
                    <div>
                      <FormattedMessage id="common.postedRelative" values={{
                        formattedAgo:
                          <FormattedRelative value={task.createdAt}>{IntlUtils.lower}</FormattedRelative>,
                      }}/>
                    </div>
                    <div>
                      <FormattedMessage id="common.expiresRelative" values={{
                        formattedAgo: <FormattedRelative value={DateUtils.addDays(task.createdAt, 15)}>{IntlUtils.lower}</FormattedRelative>,
                      }}/>
                    </div>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-icon location" />
                  <div className="detail-text">
                    {task.city}
                  </div>
                </div>
              </div>
            </div>
            <div className="image-col">
              {
                pictures.length ?
                <Slider
                  dots
                  arrows
                  infinite={false}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                >
                  {pictures}
                </Slider> :
                <div className="no-pictures"></div>
              }
              <div className="edit-pictures">
                <button className="secondary" onClick={::this._onEditPictures}>
                  <FormattedMessage id="nelpcenter.common.editPic"/>
                </button>
              </div>
            </div>
          </div>
          <div className="btn-group">
            <div className="button link-button" onClick={::this._onDelete}>
              <Icon svg={require('images/icons/delete.svg')}/>
              <FormattedMessage id="nelpcenter.common.deleteTask"/>
            </div>
          </div>
        </div>
        {applicationsSection}
      </div>
    );
  }
}

export default Relay.createContainer(TaskDetailHandler, {
  fragments: {
    task: () => Relay.QL`
      fragment on Task {
        objectId,
        createdAt,
        title,
        desc,
        priceOffered,
        city,
        location {
          latitude,
          longitude,
        },
        pictures {
          url,
        },
        applications {
          hasAccepted,
          accepted {
            objectId,
            user {
              name,
              pictureURL,
            },
            phone,
            email,
          }
          edges {
            node {
              id,
              objectId,
              state,
              price,
              state,
              user {
                name,
                pictureURL,
              },
              task {
                objectId,
                priceOffered,
              },
            }
          }
        },
        ${EditTaskDescMutation.getFragment('task')},
        ${EditTaskPicturesMutation.getFragment('task')},
      }
    `,
  },
});
