import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import cssModules from 'react-css-modules';

import Progress from 'components/Progress';
import AddLocationDialogView from './AddLocationDialogView';
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
    hasTitleInput: false,
    priceOffered: '',
    hasPriceOfferedInput: false,
    desc: '',
    hasDescInput: false,
    location: this.props.locations[0],
    openCreateLocation: false,
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
  }

  _onOpenAddLocation(event) {
    event.preventDefault();
    this.setState({openCreateLocation: true});
  }

  _onAddLocation(location) {
    UserActions.addLocation(location);
    this.setState({
      openCreateLocation: false,
      location: location,
    });
  }

  _onCancelAddLocation() {
    this.setState({openCreateLocation: false});
  }

  _onLocationChanged(event) {
    const location = this.props.locations[event.target.selectedIndex];
    this.setState({
      location,
    });
  }

  _onTitleChanged(event) {
    this.setState({
      hasTitleInput: true,
      title: event.target.value,
    });
  }

  _onPriceOfferedChanged(event) {
    this.setState({
      hasPriceOfferedInput: true,
      priceOffered: event.target.value,
    });
  }

  _onPostalCodeChanged(event) {
    this.setState({
      postalCode: event.target.value,
    });
  }

  _onDescChanged(event) {
    this.setState({
      hasDescInput: true,
      desc: event.target.value,
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

    if (!this._validateTitle() || !this._validatePrice() ||
      !this._validateLocation() || !this._validateDescription()) {
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
      <div styleName="page" className="container">
        <AddLocationDialogView
          opened={this.state.openCreateLocation}
          onLocationAdded={::this._onAddLocation}
          onCancel={::this._onCancelAddLocation} />
        <div styleName="category-header-panel" className="header-panel">
          <div styleName="category-overlay" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(this.props.params.category)}')`}} />
          <div styleName="category-icon-container">
            <div styleName="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(this.props.params.category)}')`}}/>
          </div>
          <div styleName="back-btn-container">
            <button className="back" onClick={::this._onCancel}>Select another category</button>
          </div>
        </div>
        <form onSubmit={::this._onSubmit}>
          <div styleName="task-panel" className="panel">
            <div styleName="input-row">
              <div styleName="input-content">
                <label>Enter your Task Title</label>
                <input
                  type="text"
                  required
                  minLength={4}
                  maxLength={72}
                  value={this.state.title}
                  onChange={this._onTitleChanged.bind(this)} />
              </div>
              <div styleName={this._getValidationStyleName(this.state.hasTitleInput, this._validateTitle())} />
            </div>
            <div styleName="input-row">
              <div styleName="input-content">
                <label>Briefly describe what you are looking for</label>
                <textarea
                  required
                  minLength={4}
                  value={this.state.desc}
                  onChange={this._onDescChanged.bind(this)} />
              </div>
              <div styleName={this._getValidationStyleName(this.state.hasDescInput, this._validateDescription())} />
            </div>
            <div styleName="input-row">
              <div styleName="input-content">
                <label>How much are you offering?</label>
                <div styleName="price">
                  <div styleName="currency">$</div>
                  <input
                    type="number"
                    min={0}
                    max={9999}
                    maxLength={4}
                    required
                    value={this.state.priceOffered}
                    onChange={this._onPriceOfferedChanged.bind(this)} />
                </div>
              </div>
              <div styleName={this._getValidationStyleName(this.state.hasPriceOfferedInput, this._validatePrice())} />
            </div>
            <div styleName="input-row">
              <div styleName="input-content">
                <label>Select your location</label>
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
                  <div className="btn-group">
                    {
                      locations.length ?
                      <button className="border-btn" onClick={::this._onOpenAddLocation}>Delete</button> :
                      null
                    }
                    <button className="primary" onClick={::this._onOpenAddLocation}>Add</button>
                  </div>
                </div>
                <div styleName="address">{this.state.location && this.state.location.address}</div>
              </div>
            </div>
          </div>
          <div styleName="pictures-panel" className="panel">
            <div styleName="input-row">
              <div styleName="input-content">
                <label>Attach pictures</label>
                <div styleName="pictures">
                  {pictures}
                </div>
                <div styleName="add-picture">
                  <button className="primary">Browse...</button>
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
                styleName="post-btn" className="primary">Post task!</button>
            }
          </div>
        </form>
      </div>
    );
  }
}
