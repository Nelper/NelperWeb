import React, {Component, PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import connectToStores from 'alt/utils/connectToStores';
import cssModules from 'react-css-modules';

import {Dialog, Progress, ValidatorInput} from 'components/index';
import AddLocationDialogView from 'components/AddLocationDialogView';
import TaskActions from 'actions/TaskActions';
import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';
import TaskStore from 'stores/TaskStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import ApiUtils from 'utils/ApiUtils';

import styles from './PostTaskFormHandler.scss';

@connectToStores
@cssModules(styles)
export default class PostTaskFormHandler extends Component {

  static propTypes = {
    locations: PropTypes.array,
    params: PropTypes.object,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  static getStores() {
    return [UserStore, TaskStore];
  }

  static getPropsFromStores() {
    return {
      locations: UserStore.getState().user.privateData.locations,
      createdTask: TaskStore.getState().createdTask,
    };
  }

  state = {
    title: '',
    titleError: null,
    hasTitleInput: false,
    priceOffered: '',
    priceOfferedError: null,
    hasPriceOfferedInput: false,
    desc: '',
    descError: null,
    hasDescInput: false,
    location: this.props.locations[0],
    locationError: null,
    showCreateLocationDialog: false,
    showDeleteLocationDialog: false,
    pictures: [],
    loading: false,
  }

  componentDidMount() {
    // Make sure the category is valid.
    if (TaskCategoryUtils.list().indexOf(this.props.params.category) < 0) {
      this.context.history.replaceState(null, '/post');
      return;
    }

    TaskActions.startTaskCreate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.createdTask) {
      this._onTaskCreated();
    }
    if (!nextProps.locations.some(l => l === this.state.location)) {
      this.setState({location: nextProps.locations[0]});
    }
  }

  _onOpenAddLocation(event) {
    event.preventDefault();
    this.setState({showCreateLocationDialog: true});
  }

  _onAddLocation(location) {
    UserActions.addLocation(location);
    this.setState({
      showCreateLocationDialog: false,
      location: location,
    });
  }

  _onCancelAddLocation() {
    this.setState({showCreateLocationDialog: false});
  }

  _onLocationChanged(event) {
    const location = this.props.locations[event.target.selectedIndex];
    this.setState({
      location,
      locationError: null,
    });
  }

  _onDeleteLocation(event) {
    event.preventDefault();
    this.setState({
      showDeleteLocationDialog: true,
    });
  }

  _onDeleteLocationClose() {
    this.setState({
      showDeleteLocationDialog: false,
    });
  }

  _onDeleteLocationConfirm() {
    UserActions.deleteLocation(this.state.location);
    this.setState({showDeleteLocationDialog: false});
  }

  _onTitleChanged(event) {
    this.setState({
      hasTitleInput: true,
      title: event.target.value,
      titleError: null,
    });
  }

  _onPriceOfferedChanged(event) {
    this.setState({
      hasPriceOfferedInput: true,
      priceOffered: event.target.value,
      priceOfferedError: null,
    });
  }

  _onDescChanged(event) {
    this.setState({
      hasDescInput: true,
      desc: event.target.value,
      descError: null,
    });
  }

  _onFileChanged(event) {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      const picture = {
        loading: true,
        name: file.name,
      };
      const newPictures = this.state.pictures;
      newPictures.push(picture);

      this.setState({
        pictures: newPictures,
      });

      ApiUtils.uploadFile(picture.name, file)
        .then(f => {
          // Check if the upload was canceled.
          if (picture.deleted) {
            return;
          }

          picture.loading = false;
          picture.objectId = f.objectId;
          picture.url = f.url;
          picture.file = f.file;
          this.setState({
            pictures: this.state.pictures,
          });
        });

      // Remove the file from the input to be able to upload it again.
      event.target.value = '';
    }
  }

  _onRemovePicture(p) {
    const {pictures} = this.state;
    pictures.splice(pictures.indexOf(p), 1);
    p.deleted = true;
    this.setState({pictures});
  }

  _onSubmit(e) {
    e.preventDefault();

    // TODO: TRANSLATION
    let valid = true;
    if (!this._validateTitle()) {
      this.setState({titleError: 'Please enter a title for your task.'});
      valid = false;
    }
    if (!this._validatePrice()) {
      this.setState({priceOfferedError: 'Please enter a price for your task.'});
      valid = false;
    }
    if (!this._validateLocation()) {
      this.setState({locationError: 'Please select a location for your task.'});
      valid = false;
    }
    if (!this._validateDescription()) {
      this.setState({descError: 'Please enter a description for your task.'});
      valid = false;
    }

    if (!valid) {
      this.setState({
        hasTitleInput: true,
        hasDescInput: true,
        hasPriceOfferedInput: true,
      });
      return;
    }

    TaskActions.addTask({
      title: this.state.title,
      category: this.props.params.category,
      desc: this.state.desc,
      priceOffered: parseInt(this.state.priceOffered, 10),
      location: this.state.location.coords,
      city: this.state.location.city,
      pictures: this.state.pictures,
    });

    this.setState({
      loading: true,
    });
  }

  _onCancel(event) {
    event.preventDefault();
    this.context.history.goBack();
  }

  _onTaskCreated() {
    this.context.history.pushState(null, '/center/tasks');
  }

  _getValidationStyleName(hasInput, isValid) {
    if (!hasInput) return 'no-input';
    if (!isValid) return 'invalid';
    return 'valid';
  }

  _validateTitle() {
    return this.state.title.length >= 4;
  }

  _validatePrice() {
    return this.state.priceOffered.length > 0;
  }

  _validateLocation() {
    return !!this.state.location;
  }

  _validateDescription() {
    return this.state.desc.length >= 4;
  }

  render() {
    const locations = this.props.locations.map((l, i) => {
      return (
        <option value={i} key={i}>{l.name}</option>
      );
    });

    const pictures = this.state.pictures.map((p, i) => {
      return (
        <div styleName="picture" style={{backgroundImage: `url('${p.url}')`}} key={i}>
          {
            p.loading ?
            <div styleName="picture-loading"><Progress small /></div> :
            null
          }
          <div styleName="picture-name">{p.name}</div>
          <div styleName="picture-delete" onClick={() => this._onRemovePicture(p)} />
        </div>
      );
    });

    return (
      <div styleName="module" className="container">
        <AddLocationDialogView
          opened={this.state.showCreateLocationDialog}
          onLocationAdded={::this._onAddLocation}
          onCancel={::this._onCancelAddLocation} />
        <Dialog opened={this.state.showDeleteLocationDialog} onClose={::this._onDeleteLocationClose}>
          <h2><FormattedMessage id="post.deleteLocationTitle" /></h2>
          <p className="dialog-content">
            <FormattedMessage id="post.deleteLocationMessage" values={{
              name: this.state.location && this.state.location.name,
            }} />
          </p>
          <div className="btn-group dialog-buttons">
            <button onClick={::this._onDeleteLocationClose}>
              <FormattedMessage id="common.cancel" />
            </button>
            <button className="primary" onClick={::this._onDeleteLocationConfirm}>
              <FormattedMessage id="common.delete" />
            </button>
          </div>
        </Dialog>
        <div styleName="category-header-panel" className="header-panel">
          <div styleName="category-overlay" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(this.props.params.category)}')`}} />
          <div styleName="category-icon-container">
            <div styleName="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(this.props.params.category)}')`}}/>
          </div>
          <div styleName="back-btn-container">
            <button className="back" onClick={::this._onCancel}>
              <FormattedMessage id="post.changeCategory" />
            </button>
          </div>
        </div>
        <form onSubmit={::this._onSubmit}>
          <div styleName="task-panel" className="panel">
            <div styleName="input-row">
              <div styleName="input-content">
                <label><FormattedMessage id="post.taskTitle" /></label>
                <ValidatorInput
                  type="text"
                  error={this.state.titleError}
                  value={this.state.title}
                  onChange={this._onTitleChanged.bind(this)} />
              </div>
              <div styleName={this._getValidationStyleName(this.state.hasTitleInput, this._validateTitle())} />
            </div>
            <div styleName="input-row">
              <div styleName="input-content">
                <label><FormattedMessage id="post.taskDescription" /></label>
                <ValidatorInput
                  type="textarea"
                  error={this.state.descError}
                  value={this.state.desc}
                  onChange={this._onDescChanged.bind(this)} />
              </div>
              <div styleName={this._getValidationStyleName(this.state.hasDescInput, this._validateDescription())} />
            </div>
            <div styleName="input-row">
              <div styleName="input-content">
                <label><FormattedMessage id="post.taskOffer" /></label>
                <div styleName="price">
                  <div styleName="currency">$</div>
                  <ValidatorInput
                    type="number"
                    error={this.state.priceOfferedError}
                    value={this.state.priceOffered}
                    onChange={this._onPriceOfferedChanged.bind(this)} />
                </div>
              </div>
              <div styleName={this._getValidationStyleName(this.state.hasPriceOfferedInput, this._validatePrice())} />
            </div>
            <div styleName="input-row">
              <div styleName="input-content">
                <label><FormattedMessage id="post.taskLocation" /></label>
                <div styleName="location">
                  {
                    locations.length ?
                    <select
                      value={this.props.locations.indexOf(this.state.location)}
                      onChange={::this._onLocationChanged}
                    >
                      {locations}
                    </select> :
                    null
                  }
                  {
                    this.state.locationError ?
                    <div styleName="location-error">{this.state.locationError}</div> :
                    null
                  }
                  <div className="btn-group">
                    {
                      locations.length ?
                      <button className="border-btn" onClick={::this._onDeleteLocation}>
                        <FormattedMessage id="common.delete" />
                      </button> :
                      null
                    }
                    <button className="primary" onClick={::this._onOpenAddLocation}>
                      <FormattedMessage id="common.add" />
                    </button>
                  </div>
                </div>
                {
                  this.state.location ?
                  <div styleName="address">
                    <div>{this.state.location.streetNumber} {this.state.location.route}</div>
                    <div>{this.state.location.city}, {this.state.location.postalCode}</div>
                  </div> :
                  null
                }
              </div>
            </div>
          </div>
          <div styleName="pictures-panel" className="panel">
            <div styleName="input-row">
              <div styleName="input-content">
                <label><FormattedMessage id="post.taskPictures" /></label>
                <div styleName="pictures">
                  {pictures}
                </div>
                <div styleName="add-picture">
                  <button className="primary">
                    <FormattedMessage id="common.browse" />
                  </button>
                  <input type="file" accept="image/*" onChange={::this._onFileChanged} />
                </div>
              </div>
            </div>
          </div>
          <div styleName="post-btn-container">
            {
              this.state.loading ?
              <Progress /> :
              <button
                type="submit"
                styleName="post-btn" className="primary"
              >
                <FormattedMessage id="post.post" />
              </button>
            }
          </div>
        </form>
      </div>
    );
  }
}
