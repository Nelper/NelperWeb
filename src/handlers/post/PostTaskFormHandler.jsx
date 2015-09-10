import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import classNames from 'classnames';

import Progress from 'components/Progress';
import AddLocationDialogView from './AddLocationDialogView';
import TaskActions from 'actions/TaskActions';
import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';
import TaskStore from 'stores/TaskStore';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import ApiUtils from 'utils/ApiUtils';

@connectToStores
export default class PostTaskFormHandler extends Component {

  static propTypes = {
    locations: PropTypes.array,
    params: PropTypes.object,
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
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
      this.context.router.replaceWith('/post');
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
          picture.loading = false;
          picture.objectId = f.objectId;
          picture.url = f.url;
          picture.file = f.file;
          this.setState({
            pictures: this.state.pictures,
          });
        });
    }
  }

  _onSubmit(e) {
    e.preventDefault();

    if (!this._validateTitle() || !this._validatePrice() ||
      !this._validateLocation() || !this._validateDescription()) {
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
    this.context.router.goBack();
  }

  _onTaskCreated() {
    this.context.router.transitionTo('/center/tasks');
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

    const pictures = this.state.pictures.map(p => {
      return (
        <div className={classNames('picture', {'loading': p.loading})} style={{backgroundImage: `url('${p.url}')`}} key={p.name}>
          <div className="picture-name">{p.name}</div>
        </div>
      );
    });

    return (
      <div className="post-task-form-handler container">
        <AddLocationDialogView
          opened={this.state.openCreateLocation}
          onLocationAdded={::this._onAddLocation}
          onCancel={::this._onCancelAddLocation} />
        <div className="header-panel category-header-panel">
          <div className="category-overlay" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(this.props.params.category)}')`}} />
          <div className="category-content">
            <div className="category-icon" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(this.props.params.category)}')`}}/>
            <div className="select-category">
              <button className="back">Select another category</button>
            </div>
          </div>
        </div>
        <form onSubmit={::this._onSubmit}>
          <div className="panel pad-all">
            <div className="input-row">
              <div className="input-content">
                <label className="title">Enter your Task Title</label>
                <input
                  type="text"
                  required
                  minLength={4}
                  maxLength={72}
                  value={this.state.title}
                  onChange={this._onTitleChanged.bind(this)} />
              </div>
              <div className={classNames(
                'validation-icon',
                {'valid': this.state.hasTitleInput && this._validateTitle()},
                {'invalid': this.state.hasTitleInput && !this._validateTitle()},
              )} />
            </div>
            <div className="input-row">
              <div className="input-content">
                <label className="title">Briefly describe what you are looking for</label>
                <textarea
                  required
                  minLength={4}
                  value={this.state.desc}
                  onChange={this._onDescChanged.bind(this)} />
              </div>
              <div className={classNames(
                'validation-icon',
                {'valid': this.state.hasDescInput && this._validateDescription()},
                {'invalid': this.state.hasDescInput && !this._validateDescription()},
              )} />
            </div>
            <div className="input-row">
              <div className="input-content">
                <label className="title">How much are you offering?</label>
                <div className="price">
                  <div className="currency">$</div>
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
              <div className={classNames(
                'validation-icon',
                {'valid': this.state.hasPriceOfferedInput && this._validatePrice()},
                {'invalid': this.state.hasPriceOfferedInput && !this._validatePrice()},
              )} />
            </div>
            <div className="input-row">
              <div className="input-content">
                <label className="title">Select your location</label>
                <div className="location">
                  {
                    locations.length ?
                    <div>
                      <select value={this.props.locations.indexOf(this.state.location)}
                              onChange={::this._onLocationChanged}>
                        {locations}
                      </select>
                    </div> :
                    null
                  }
                  <button className="primary" onClick={::this._onOpenAddLocation}>Add</button>
                </div>
                <div className="address">{this.state.location && this.state.location.address}</div>
              </div>
            </div>
          </div>
          <div className="panel pad-all">
            <div className="input-row">
              <div className="input-content">
                <label className="title">Attach pictures</label>
                <div key="add" className="pictures">
                  <div className="add-picture">
                    <button className="primary">Browse...</button>
                    <input type="file" accept="image/*" onChange={::this._onFileChanged} />
                  </div>
                  {pictures}
                </div>
              </div>
            </div>
          </div>
          <div className="post-btn-container">
            {
              this.state.loading ?
              <Progress /> :
              <button
                type="submit"
                className="primary post-btn">Post task!</button>
            }
          </div>
        </form>
      </div>
    );
  }
}
