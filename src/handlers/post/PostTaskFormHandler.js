import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import {FormattedMessage} from 'react-intl';
import cssModules from 'react-css-modules';

import {Dialog, Progress, ValidatorInput} from 'components/index';
import AddLocationDialogView from 'components/AddLocationDialogView';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';
import ApiUtils from 'utils/ApiUtils';
import PostTaskMutation from 'actions/post/PostTaskMutation';
import {
  AddLocationMutation,
  DeleteLocationMutation,
} from 'actions/settings/index';
import {MIN_PRICE, MAX_PRICE, MIN_TITLE_LENGTH, MIN_DESC_LENGTH} from 'utils/constants';

import styles from './PostTaskFormHandler.scss';

@cssModules(styles)
class PostTaskFormHandler extends Component {

  static propTypes = {
    params: PropTypes.object,
    me: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

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
    locationIndex: 0,
    locationError: null,
    showCreateLocationDialog: false,
    showDeleteLocationDialog: false,
    pictures: [],
    loading: false,
  };

  componentDidMount() {
    // Make sure the category is valid.
    if (TaskCategoryUtils.list().indexOf(this.props.params.category) < 0) {
      this.context.router.replaceState(null, '/post');
      return;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.locationIndex >= nextProps.me.privateData.locations.length) {
      this.setState({locationIndex: 0});
    }
  }

  _onOpenAddLocation(event) {
    event.preventDefault();
    this.setState({showCreateLocationDialog: true});
  }

  _onAddLocation(location) {
    Relay.Store.update(
      new AddLocationMutation({
        privateData: this.props.me.privateData,
        location,
      })
    );
    this.setState({
      showCreateLocationDialog: false,
      locationIndex: this.props.me.privateData.locations.length - 1,
      locationError: null,
    });
  }

  _onCancelAddLocation() {
    this.setState({showCreateLocationDialog: false});
  }

  _onLocationChanged(event) {
    this.setState({
      locationIndex: event.target.selectedIndex,
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
    Relay.Store.update(
      new DeleteLocationMutation({
        privateData: this.props.me.privateData,
        index: this.state.locationIndex,
      })
    );
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
    const value = event.target.value;
    if (value.length <= 3) {
      this.setState({
        hasPriceOfferedInput: true,
        priceOffered: value,
        priceOfferedError: null,
      });
    }
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
    let valid = true;
    if (!this._validateTitle()) {
      this.setState({titleError: <FormattedMessage id="post.errorTitle" />});
      valid = false;
    }
    if (!this._validateDescription()) {
      this.setState({descError: <FormattedMessage id="post.errorDesc" />});
      valid = false;
    }
    if (!this._validatePrice()) {
      this.setState({priceOfferedError: <FormattedMessage id="post.errorPrice" values={{
        min: MIN_PRICE,
        max: MAX_PRICE,
      }} />});
      valid = false;
    }
    if (!this._validateLocation()) {
      this.setState({locationError: <FormattedMessage id="post.errorLocation" />});
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

    Relay.Store.update(
      new PostTaskMutation({
        me: this.props.me,
        task: {
          title: this.state.title,
          category: this.props.params.category,
          desc: this.state.desc,
          priceOffered: parseInt(this.state.priceOffered, 10),
          location: this._getLocation(this.state.locationIndex),
          pictures: this.state.pictures,
        },
      })
    );

    this.context.router.pushState(null, '/center/tasks');
  }

  _onCancel(event) {
    event.preventDefault();
    this.context.router.goBack();
  }

  _getValidationStyleName(hasInput, isValid) {
    if (!hasInput) return 'no-input';
    if (!isValid) return 'invalid';
    return 'valid';
  }

  _getLocation(index) {
    return this.props.me.privateData.locations[index];
  }

  _validateTitle() {
    return this.state.title.length >= MIN_TITLE_LENGTH;
  }

  _validatePrice() {
    const price = parseInt(this.state.priceOffered, 10);
    return price >= MIN_PRICE && price <= MAX_PRICE;
  }

  _validateLocation() {
    return !!this._getLocation(this.state.locationIndex);
  }

  _validateDescription() {
    return this.state.desc.length >= MIN_DESC_LENGTH;
  }

  render() {
    const locations = this.props.me.privateData.locations.map((l, i) => {
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

    const location = this._getLocation(this.state.locationIndex);

    return (
      <div styleName="module" className="container">
        <AddLocationDialogView
          opened={this.state.showCreateLocationDialog}
          onLocationAdded={::this._onAddLocation}
          onCancel={::this._onCancelAddLocation} />
        <Dialog
          opened={this.state.showDeleteLocationDialog}
          onClose={::this._onDeleteLocationClose}
          className="pad-all"
        >
          <h2><FormattedMessage id="post.deleteLocationTitle" /></h2>
          <p className="dialog-content">
            <FormattedMessage id="post.deleteLocationMessage" values={{
              name: location && location.name,
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
                      value={this.state.locationIndex}
                      onChange={::this._onLocationChanged}
                    >
                      {locations}
                    </select> :
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
                  this.state.locationError ?
                  <div styleName="location-error">{this.state.locationError}</div> :
                  null
                }
                {
                  location ?
                  <div styleName="address">
                    <div>{location.streetNumber} {location.route}</div>
                    <div>{location.city}, {location.postalCode}</div>
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

export default Relay.createContainer(PostTaskFormHandler, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        privateData {
          locations {
            name,
            streetNumber,
            route,
            city,
            postalCode,
            province,
            country,
            coords {
              latitude,
              longitude,
            }
          },
          ${AddLocationMutation.getFragment('privateData')},
          ${DeleteLocationMutation.getFragment('privateData')},
        },
        ${PostTaskMutation.getFragment('me')},
      }
    `,
  },
});
