import React, {Component, PropTypes} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';
import Icon from 'components/Icon';
import Editable from 'components/Editable';

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
    editSkills: false,
    skillText: '',
    editedSkill: null,
    editExperience: false,
    experienceText: '',
    editedExperience: null,
  }

  _onEditAbout(about) {
    UserActions.editAbout(about);
  }

  _onAddSkill() {
    this.setState({
      editSkills: true,
      skillText: '',
    });
  }

  _onEditSkillStart() {
    this.setState({
      editSkills: true,
    });
  }

  _onEditSkillCancel() {
    this.setState({
      editSkills: false,
    });
  }

  _onEditSkillDone(skill, title) {
    skill.title = title;
    UserActions.editSkill(skill);
    this.setState({
      editSkills: false,
    });
  }

  _onDeleteSkill(skill) {
    UserActions.deleteSkill(skill);
  }

  _onDoneEditSkills(event) {
    event.preventDefault();
    if (!this.state.editedSkill) {
      UserActions.addSkill({
        title: this.state.skillText,
      });
    } else {
      const skill = this.state.editedSkill;
      skill.title = this.state.skillText;
      UserActions.editSkill(skill);
    }
    this.setState({
      editSkills: false,
      skillText: '',
      editedSkill: null,
    });
  }

  _onCancelEditSkills(event) {
    event.preventDefault();
    this.setState({
      editSkills: false,
      skillText: '',
      editedSkill: null,
    });
  }

  _onSkillTextChanged(event) {
    this.setState({skillText: event.target.value});
  }

  _onAddExperience() {
    this.setState({editExperience: true});
  }

  _onEditExperience(exp) {
    this.setState({
      editExperience: true,
      experienceText: exp.title,
      editedExperience: exp,
    });
  }

  _onDeleteExperience(exp) {
    UserActions.deleteExperience(exp);
  }

  _onDoneEditExperience(event) {
    event.preventDefault();
    if (!this.state.editedExperience) {
      UserActions.addExperience({
        title: this.state.experienceText,
      });
    } else {
      const exp = this.state.editedExperience;
      exp.title = this.state.experienceText;
      UserActions.editExperience(exp);
    }
    this.setState({
      editExperience: false,
      experienceText: '',
      editedExperience: null,
    });
  }

  _onCancelEditExperience(event) {
    event.preventDefault();
    this.setState({
      editExperience: false,
      experienceText: '',
      editedExperience: null,
    });
  }

  _onExperienceTextChanged(event) {
    this.setState({experienceText: event.target.value});
  }

  render() {
    const {user} = this.props;

    const skills = user.skills.map(s => {
      return (
        <div className="skill" key={s.objectId}>
          <Editable
            deletable={true}
            onEditStart={::this._onEditSkillStart}
            onEditCancel={::this._onEditSkillCancel}
            onEditDone={(val) => this._onEditSkillDone(s, val)}
            onDelete={() => this._onDeleteSkill(s)}
            initialValue={s.title}
            editBoxRef={this.refs.skillEditBox}
          />
        </div>
      );
    });

    const experience = user.experience.map(e => {
      return (
        <div className="editable" key={e.objectId}>
          <div className="dot" />
          <div className="editable-title">{e.title}</div>
          <button className="editable-action edit" onClick={() => this._onEditExperience(e)}>
            <div className="editable-icon-bg" />
            <Icon className="editable-icon" svg={require('images/icons/edit.svg')}/>
          </button>
          <button className="editable-action delete" onClick={() => this._onDeleteExperience(e)}>
            <div className="editable-icon-bg" />
            <Icon className="editable-icon" svg={require('images/icons/delete.svg')}/>
          </button>
        </div>
      );
    });

    return (
      <div className="profile-handler">
        <div className="container pad-all">
          <div className="section-row">
            <div className="section-title">
              About
            </div>
            <div className="section-content">
              <Editable
                multiline={true}
                onEditDone={::this._onEditAbout}
                initialValue={user.about}
                editPlaceholder="Write something about you..."
              />
            </div>
          </div>
          <div className="section-row">
            <div className="section-title">
              Skills
            </div>
            <div className="section-content">
              <div className="skills">
                {skills}
              </div>
              <div ref="skillEditBox" />
              {
                !this.state.editSkills ?
                <button className="add-skill light primary" onClick={::this._onAddSkill}>Add new skill</button> :
                null
              }
            </div>
          </div>
          <div className="section-row">
            <div className="section-title">
              Experience
            </div>
            <div className="section-content">
              <div className="experience">
                {experience}
              </div>
              {
                !this.state.editExperience ?
                <button className="light primary" onClick={::this._onAddExperience}>Add new experience</button> :
                <div className="edit-box">
                  <form onSubmit={::this._onDoneEditExperience}>
                    <input
                      type="text"
                      placeholder="Enter something you did..."
                      value={this.state.experienceText}
                      maxLength={30}
                      required={true}
                      onChange={::this._onExperienceTextChanged} />
                    <input
                      type="text"
                      placeholder="Where it was..."
                      value={this.state.experienceText}
                      maxLength={30}
                      required={true}
                      onChange={::this._onExperienceTextChanged} />
                    <input
                      type="text"
                      placeholder="When..."
                      value={this.state.experienceText}
                      maxLength={30}
                      required={true}
                      onChange={::this._onExperienceTextChanged} />

                    <div className="btn-group">
                      <button type="submit" className="primary">OK</button>
                      <button onClick={::this._onCancelEditExperience}>Cancel</button>
                    </div>
                  </form>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
