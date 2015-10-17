import React, {Component, PropTypes} from 'react';

import Dialog from 'components/Dialog';
import IconButton from 'components/IconButton';
import Progress from 'components/Progress';
import ApiUtils from 'utils/ApiUtils';

export default class EditPicturesDialogView extends Component {

  static propTypes = {
    pictures: PropTypes.array.isRequired,
    opened: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddPicture: PropTypes.func,
    onDeletePicture: PropTypes.func,
  }

  static defaultProps = {
    onAddPicture: () => {},
    onDeletePicture: () => {},
    onClose: () => {},
  }

  state = {
    pictures: this.props.pictures,
  }

  componentWillReceiveProps(newProps) {
    this.setState({pictures: newProps.pictures});
  }

  _onFileChanged(event) {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      const picture = {
        loading: true,
        name: file.name,
      };
      const newPictures = this.state.pictures.concat([picture]);
      this.setState({
        pictures: newPictures,
      });
      ApiUtils.uploadFile(picture.name, file)
        .then(f => {
          picture.loading = false;
          picture.objectId = f.objectId;
          picture.url = f.url;
          picture.file = f.file;
          this.props.onAddPicture(picture);
        });
    }
  }

  render() {
    const pictures = this.state.pictures.map((p, i) => {
      return (
        <div key={i} className="edit-picture">
          {
            !p.loading ?
            <IconButton
              className="edit-picture-delete-icon"
              icon={require('images/icons/delete.svg')}
              onClick={() => this.props.onDeletePicture(p)}
            /> : null
          }
          {
            !p.loading ?
            <div className="edit-picture-image" style={{backgroundImage: `url('${p.url}')`}} /> :
            <div className="edit-picture-loading"><Progress small /></div>
          }
          <div className="edit-picture-title">{p.name}</div>
        </div>
      );
    });

    return (
      <Dialog opened={this.props.opened} onClose={this.props.onClose} className="pad-all">
        <div className="edit-pictures-dialog-view">
          <h2>Edit pictures</h2>
          <div className="edit-picture-list">
            {pictures}
            <div className="add-picture">
              <div className="add-picture-icon" />
              <input type="file" accept="image/*" onChange={::this._onFileChanged} />
            </div>
          </div>
          <div className="btn-group dialog-buttons">
            <button onClick={this.props.onClose} className="primary">
              Done
            </button>
          </div>
        </div>
      </Dialog>
    );
  }
}
