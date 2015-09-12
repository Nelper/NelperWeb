import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';
import Editable, {EditableBox} from 'components/Editable';
import Rating from 'components/Rating';
import ApiUtils from 'utils/ApiUtils';

@connectToStores
export default class ProfileHandler extends Component {

  static propTypes = {
    user: PropTypes.object,
  }

  static contextTypes = {
    history: PropTypes.object.isRequired,
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
    addingEducation: false,
  }

  _onUploadPicture(event) {
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
    this.context.history.goBack();
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

  _onAddEducation() {
    this.setState({
      addingEducation: true,
    });
  }

  _onAddEducationDone(title) {
    UserActions.addEducation({
      title,
    });
    this.setState({
      addingEducation: false,
    });
  }

  _onAddEducationCancel() {
    this.setState({
      addingEducation: false,
    });
  }

  _onEditEducationDone(ed, title) {
    ed.title = title;
    UserActions.editEducation(ed);
  }

  _onDeleteEducation(ed) {
    UserActions.deleteEducation(ed);
  }

  render() {
    const {user} = this.props;

    const skills = user.skills.map(s => {
      return (
        <div className="skill" key={s.objectId}>
          <Editable
            deletable
            onEditDone={(val) => this._onEditSkillDone(s, val)}
            onDelete={() => this._onDeleteSkill(s)}
            value={s.title}
          />
        </div>
      );
    });

    const education = user.education.map(e => {
      return (
        <div className="education" key={e.objectId}>
          <Editable
            deletable
            onEditDone={(val) => this._onEditEducationDone(e, val)}
            onDelete={() => this._onDeleteEducation(e)}
            value={e.title}
          />
        </div>
      );
    });

    const experience = user.experience.map(e => {
      return (
        <div className="experience" key={e.objectId}>
          <Editable
            deletable
            onEditDone={(val) => this._onEditExperienceDone(e, val)}
            onDelete={() => this._onDeleteExperience(e)}
            value={e.title}
          />
        </div>
      );
    });

    return (
      <div className="profile-handler container">
        <div className="profile-header header-panel">
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
          </div>
        </div>
        <div className="container">
          <div className="panel pad-all section-row">
            <div className="section-title">
              <div className="section-icon section-icon-about" />
              <div>About</div>
            </div>
            <div className="section-content">
              <Editable
                multiline
                onEditDone={::this._onEditAbout}
                value={user.about}
                editPlaceholder="Write something about you..."
              />
            </div>
          </div>
          <div className="panel pad-all section-row">
            <div className="section-title">
              <div className="section-icon section-icon-skills" />
              <div>Skills</div>
            </div>
            <div className="section-content">
              <div className="skills">
                {skills}
              </div>
              {
                !this.state.addingSkill ?
                <button className="add-skill link-button" onClick={::this._onAddSkill}>Add skill</button> :
                <EditableBox
                  onEditDone={::this._onAddSkillDone}
                  onEditCancel={::this._onAddSkillCancel}
                />
              }
            </div>
          </div>
          <div className="panel pad-all section-row">
            <div className="section-title">
              <div className="section-icon section-icon-education" />
              <div>Education</div>
            </div>
            <div className="section-content">
              <div className="education">
                {education}
              </div>
              {
                !this.state.addingEducation ?
                <button className="link-button" onClick={::this._onAddEducation}>Add education</button> :
                <EditableBox
                  onEditDone={::this._onAddEducationDone}
                  onEditCancel={::this._onAddEducationCancel}
                />
              }
            </div>
          </div>
        </div>
        <div className="panel pad-all section-row">
          <div className="section-title">
            <div className="section-icon section-icon-work" />
            <div>Work experience</div>
          </div>
          <div className="section-content">
            <div className="experience">
              {experience}
            </div>
            {
              !this.state.addingExperience ?
              <button className="link-button" onClick={::this._onAddExperience}>Add work experience</button> :
              <EditableBox
                onEditDone={::this._onAddExperienceDone}
                onEditCancel={::this._onAddExperienceCancel}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}
