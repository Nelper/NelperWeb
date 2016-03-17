import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import {EditAboutMutation, EditProfilePictureMutation} from 'actions/profile/index';
import EditSkillsView from './EditSkillsView';
import EditEducationView from './EditEducationView';
import EditExperienceView from './EditExperienceView';
import Editable from 'components/Editable';
import Rating from 'components/Rating';
import ApiUtils from 'utils/ApiUtils';

import styles from './ProfileHandler.scss';

@cssModules(styles)
class ProfileHandler extends Component {

  static propTypes = {
    me: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  _onUploadPicture(event) {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      ApiUtils.uploadFile(file.name, file)
        .then(f => {
          Relay.Store.update(
            new EditProfilePictureMutation({
              me: this.props.me,
              picture: f,
            }),
          );
        });
    }
  }

  _onBack() {
    this.context.router.goBack();
  }

  _onEditAbout(about) {
    Relay.Store.update(
      new EditAboutMutation({
        me: this.props.me,
        about,
      }),
    );
  }

  render() {
    const {me} = this.props;

    return (
      <div styleName="module" className="container">
        <div styleName="profile-header" className="header-panel">
          <div styleName="picture-picker">
            <div
              styleName="picture"
              style={{backgroundImage: `url('${me.pictureURL}')`}} />
            <div styleName="edit-picture-overlay">
              <div styleName="edit-picture-icon" />
              <div styleName="edit-picture-text">
                <FormattedMessage id="profile.editPicture" />
              </div>
            </div>
            <input type="file" onChange={::this._onUploadPicture} />
          </div>
          <div styleName="info-container">
            <div styleName="user-name">
              {me.name}
            </div>
            <Rating rating={me.rating} number={me.tasksCompleted} />
          </div>
        </div>
        <div className="container">
          <div className="panel pad-all profile-section-row">
            <div className="profile-section-title">
              <div styleName="section-icon-about" className="profile-section-icon" />
              <div>
                <FormattedMessage id="profile.about" />
              </div>
            </div>
            <div className="profile-section-content">
              <Editable
                multiline
                onEditDone={::this._onEditAbout}
                value={me.about}
              />
            </div>
          </div>
          <EditSkillsView me={me} />
          <EditEducationView me={me} />
          <EditExperienceView me={me} />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(ProfileHandler, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        name,
        pictureURL,
        rating,
        tasksCompleted,
        about,
        ${EditSkillsView.getFragment('me')},
        ${EditEducationView.getFragment('me')},
        ${EditExperienceView.getFragment('me')},
        ${EditProfilePictureMutation.getFragment('me')},
      }
    `,
  },
});
