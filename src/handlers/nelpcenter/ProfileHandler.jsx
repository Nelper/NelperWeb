import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';
import moment from 'moment';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';
import Icon from 'components/Icon';
import Editable, {EditableBox} from 'components/Editable';
import Rating from 'components/Rating';

@connectToStores
export default class ProfileHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static getStores() {
    return [UserStore];
  }

  static getPropsFromStores() {
    return UserStore.getState();
  }

  state = {
    addingSkill: false,
    addingExperience: false,
  }

  _onUploadPicture() {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      ApiUtils.uploadFile(file.name, file)
        .then(f => {
          UserActions.setPicture(f);
        });
    }
  }

  _onBack() {
    this.context.router.goBack();
  }

  _onEditAbout(about) {
    UserActions.editAbout(about);
  }

  _onAddSkill() {
    this.setState({
      addingSkill: true,
    });
  }

  _onAddSkillDone(title) {
    UserActions.addSkill({
      title,
    });
    this.setState({
      addingSkill: false,
    });
  }

  _onAddSkillCancel() {
    this.setState({
      addingSkill: false,
    });
  }

  _onEditSkillDone(skill, title) {
    skill.title = title;
    UserActions.editSkill(skill);
  }

  _onDeleteSkill(skill) {
    UserActions.deleteSkill(skill);
  }

  _onAddExperience() {
    this.setState({
      addingExperience: true,
    });
  }

  _onAddExperienceDone(title) {
    UserActions.addExperience({
      title,
    });
    this.setState({
      addingExperience: false,
    });
  }

  _onAddExperienceCancel() {
    this.setState({
      addingExperience: false,
    });
  }

  _onEditExperienceDone(exp, title) {
    exp.title = title;
    UserActions.editExperience(exp);
  }

  _onDeleteExperience(exp) {
    UserActions.deleteExperience(exp);
  }

  render() {
    const {user} = this.props;

    const skills = user.skills.map(s => {
      return (
        <div className="skill" key={s.objectId}>
          <Editable
            deletable={true}
            onEditDone={(val) => this._onEditSkillDone(s, val)}
            onDelete={() => this._onDeleteSkill(s)}
            value={s.title}
          />
        </div>
      );
    });

    const experience = user.experience.map(e => {
      return (
        <div className="experience" key={e.objectId}>
          <Editable
            deletable={true}
            onEditDone={(val) => this._onEditExperienceDone(e, val)}
            onDelete={() => this._onDeleteExperience(e)}
            value={e.title}
          />
        </div>
      );
    });

    return (
      <div className="profile-handler container">
        <div className="profile-header">
          <div className="picture-picker">
            <div
              className="picture"
              style={{backgroundImage: `url('${user.pictureURL}')`}} />
            <div className="edit-picture-overlay">
              <div className="edit-picture-icon" />
              <div className="edit-picture-text">Edit picture</div>
            </div>
            <input type="file" onChange={::this._onUploadPicture} />
          </div>
          <div className="info-container">
            <div className="user-name">
              {user.name}
            </div>
            <Rating rating={4} />
            <div className="tasks-completed">8 tasks completed</div>
            <div className="member-since">
              Member since {moment(user.createdAt).format('MMMM Do YYYY')}
            </div>
          </div>
        </div>
        <div className="container">
          <button className="back" onClick={::this._onBack}>Back</button>
          <div className="panel section-row">
            <div className="section-title">
              About
            </div>
            <div className="section-content">
              <Editable
                multiline={true}
                onEditDone={::this._onEditAbout}
                value={user.about}
                editPlaceholder="Write something about you..."
              />
            </div>
          </div>
          <div className="panel section-row">
            <div className="section-title">
              Skills
            </div>
            <div className="section-content">
              <div className="skills">
                {skills}
              </div>
              {
                !this.state.addingSkill ?
                <button className="add-skill light primary" onClick={::this._onAddSkill}>Add new skill</button> :
                <EditableBox
                  onEditDone={::this._onAddSkillDone}
                  onEditCancel={::this._onAddSkillCancel}
                />
              }
            </div>
          </div>
          <div className="panel section-row">
            <div className="section-title">
              Experience
            </div>
            <div className="section-content">
              <div className="experience">
                {experience}
              </div>
              {
                !this.state.addingExperience ?
                <button className="light primary" onClick={::this._onAddExperience}>Add new experience</button> :
                <EditableBox
                  onEditDone={::this._onAddExperienceDone}
                  onEditCancel={::this._onAddExperienceCancel}
                />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
