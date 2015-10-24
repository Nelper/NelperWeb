import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {FormattedMessage, FormattedRelative} from 'react-intl';
import cssModules from 'react-css-modules';

import ApplicationListView from './ApplicationListView';
import AcceptedApplicationView from './AcceptedTaskView';
import EditPicturesDialogView from './EditPicturesDialogView';
import ConfirmAcceptNelperDialogView from './ConfirmAcceptNelperDialogView';
import {
  Dialog,
  Editable,
  PriceTag,
  TaskPictureSlider,
} from 'components/index';
import {
  EditTaskTitleMutation,
  EditTaskDescMutation,
  EditTaskPicturesMutation,
  AcceptApplicantMutation,
  DenyApplicantMutation,
  RestoreApplicantMutation,
  DeleteTaskMutation,
  RemoveAcceptedApplicantMutation,
} from 'actions/nelpcenter/index';
import IntlUtils from 'utils/IntlUtils';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';

import styles from './TaskDetailHandler.scss';

@cssModules(styles)
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
    confirmAcceptApplication: null,
    confirmed: false,
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

  _onTitleChanged(title) {
    Relay.Store.update(
      new EditTaskTitleMutation({
        task: this.props.task,
        title,
      })
    );
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
    this.setState({confirmAcceptApplication: application});
  }

  _onCancelAccept() {
    this.setState({confirmAcceptApplication: null});
  }

  _onConfirmAccept() {
    Relay.Store.update(
      new AcceptApplicantMutation({
        task: this.props.task,
        application: this.state.confirmAcceptApplication,
      })
    );
    this.setState({confirmAcceptApplication: null, confirmed: false});
  }

  _onDeny(application) {
    // TODO: fix this
    Relay.Store.update(
      new DenyApplicantMutation({
        task: this.props.task,
        application,
      })
    );
  }

  _onRestore(application) {
    Relay.Store.update(
      new RestoreApplicantMutation({
        task: this.props.task,
        application,
      })
    );
  }

  _onViewApplication(application) {
    this.context.history.pushState(null, `/center/tasks/detail/${this.props.params.taskId}/${application.id}`);
  }

  _onCancelDelete() {
    this.setState({confirmDeleteOpened: false});
  }

  _onConfirmDelete() {
    Relay.Store.update(
      new DeleteTaskMutation({
        task: this.props.task,
      }),
    );
    this.context.history.goBack();
  }

  _onDelete() {
    this.setState({confirmDeleteOpened: true});
  }

  _onRemoveAccepted() {
    Relay.Store.update(
      new RemoveAcceptedApplicantMutation({
        task: this.props.task,
      }),
    );
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

  _renderButtomActionButton() {
    if (this.props.task.acceptedApplication) {
      if (this.props.task.completionState !== 'ACCEPTED') {
        return null;
      }
      return (
        <button className="white-button" onClick={::this._onRemoveAccepted}>
          <FormattedMessage id="nelpcenter.taskDetail.removeApplicant" />
        </button>
      );
    }
    return (
      <button className="white-button" onClick={::this._onDelete}>
        <FormattedMessage id="nelpcenter.common.deleteTask" />
      </button>
    );
  }

  render() {
    const {task} = this.props;
    const location = task.userPrivate.exactLocation;
    const {confirmDeleteOpened, editPicturesOpened, confirmAcceptApplication} = this.state;
    const applications = task.applications.edges.map(a => a.node);
    const pendingApplications = applications.filter(a => a.state === 'PENDING');
    const deniedApplications = applications.filter(a => a.state === 'DENIED');

    const acceptedApplication = task.acceptedApplication;
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
              <div styleName="pending-icon" />
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
              <div styleName="denied-icon" />
              <h2>
                <FormattedMessage id="nelpcenter.taskDetail.nelperDenied"/>
              </h2>
            </div>
            <ApplicationListView
              applications={deniedApplications}
              onRestore={::this._onRestore}
              onViewProfile={::this._onViewApplication}
            />
          </div> :
          null
        }
        </div>
      );
    }

    return (
      <div styleName="module" className="container">
        <Dialog
          className="pad-all"
          opened={confirmDeleteOpened}
          onClose={::this._onCancelDelete}
        >
          <h1>
            <FormattedMessage id="common.warning"/>
          </h1>
          <div className="dialog-content">
            <FormattedMessage id="nelpcenter.taskDetail.deleteConfirm" values={{
              title: task.title,
            }}/>
          </div>
          <div className="btn-group dialog-buttons">
            <button onClick={::this._onCancelDelete}>
              <FormattedMessage id="common.cancel"/>
            </button>
            <button onClick={::this._onConfirmDelete} className="primary">
              <FormattedMessage id="common.delete"/>
            </button>
          </div>
        </Dialog>
        <ConfirmAcceptNelperDialogView
          application={confirmAcceptApplication}
          opened={!!confirmAcceptApplication}
          onClose={::this._onCancelAccept}
          onConfirm={::this._onConfirmAccept}
        />
        <EditPicturesDialogView
          pictures={task.pictures || []}
          opened={editPicturesOpened}
          onClose={::this._onEditPicturesClose}
          onAddPicture={::this._onEditPicturesAdd}
          onDeletePicture={::this._onEditPicturesDelete}
        />
      <div styleName="detail-container" className="panel">
          <div styleName="other-info-container">
            <div styleName="other-info-col">
              <div styleName="title-row">
                <div styleName="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(task.category)}')`}} />
                <Editable value={task.title} onEditDone={::this._onTitleChanged}>
                  <h2 styleName="title">{task.title}</h2>
                </Editable>
              </div>
              <div styleName="description">
                <Editable
                  multiline
                  onEditDone={::this._onDescChanged}
                  value={task.desc}
                />
              </div>
              {
                acceptedApplication ?
                <div styleName="other-info-split">
                  <div styleName="detail-row">
                    <div styleName="location" />
                    <div styleName="location-address">
                      <div>{location.streetNumber} {location.route}</div>
                      <div>{location.city}, {location.province}</div>
                      <div>{location.postalCode}</div>
                    </div>
                  </div>
                  <div styleName="detail-row">
                    <div styleName="agreed-price">Agreed price</div>
                    <PriceTag price={acceptedApplication.price} />
                  </div>
                </div> :
                <div styleName="other-info-split">
                  <div styleName="detail-row">
                    <div styleName="applicants-count" />
                    <div styleName="detail-text">
                      <FormattedMessage id="nelpcenter.common.nelperCount" values={{
                        num: pendingApplications.length,
                      }}/>
                    </div>
                  </div>
                  <div styleName="detail-row">
                    <PriceTag price={task.priceOffered} />
                  </div>
                  <div styleName="detail-row">
                    <div styleName="location" />
                    <div styleName="location-address">
                      <div>{location.streetNumber} {location.route}</div>
                      <div>{location.city}, {location.province}</div>
                      <div>{location.postalCode}</div>
                    </div>
                  </div>
                  <div styleName="detail-row">
                    <div styleName="calendar" />
                    <div styleName="detail-text">
                      <div>
                        <FormattedMessage id="common.postedRelative" values={{
                          formattedAgo:
                            <FormattedRelative value={task.createdAt}>{IntlUtils.lower}</FormattedRelative>,
                        }}/>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
            <div styleName="image-col">
              {
                task.pictures.length ?
                <TaskPictureSlider task={task} /> :
                <div styleName="no-pictures"></div>
              }
              <div styleName="edit-pictures">
                <button className="border-btn secondary" onClick={::this._onEditPictures}>
                  <FormattedMessage id="nelpcenter.common.editPic"/>
                </button>
              </div>
            </div>
          </div>
        </div>
        {applicationsSection}
        <div styleName="delete-button-container">
          {this._renderButtomActionButton()}
        </div>
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
        category,
        priceOffered,
        city,
        completionState,
        location {
          latitude,
          longitude,
        },
        pictures {
          url,
        },
        userPrivate {
          exactLocation {
            streetNumber,
            route,
            city,
            province,
            postalCode,
          },
        },
        acceptedApplication {
          objectId,
          user {
            name,
            pictureURL,
            rating,
            tasksCompleted,
          },
          price,
          phone,
          email,
        },
        applications {
          edges {
            node {
              id,
              state,
              ${ApplicationListView.getFragment('applications')},
              ${AcceptApplicantMutation.getFragment('application')},
              ${DenyApplicantMutation.getFragment('application')},
              ${RestoreApplicantMutation.getFragment('application')},
              ${ConfirmAcceptNelperDialogView.getFragment('application')},
            }
          }
        },
        ${AcceptedApplicationView.getFragment('task')},
        ${EditTaskTitleMutation.getFragment('task')},
        ${EditTaskDescMutation.getFragment('task')},
        ${EditTaskPicturesMutation.getFragment('task')},
        ${AcceptApplicantMutation.getFragment('task')},
        ${DenyApplicantMutation.getFragment('task')},
        ${RestoreApplicantMutation.getFragment('task')},
        ${DeleteTaskMutation.getFragment('task')},
        ${RemoveAcceptedApplicantMutation.getFragment('task')},
      }
    `,
  },
});
