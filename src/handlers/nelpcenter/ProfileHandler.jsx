import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';
import Icon from 'components/Icon';
import Editable from 'components/Editable';

@connectToStores
export default class ProfileHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
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

  render() {
    let {user} = this.props;

    let skills = user.skills.map(s => {
      return (
        <div className="skill" key={s.objectId}>
          <Editable
            deletable={true}
            onEditStart={::this._editSkillStart}
            onEditCancel={::this._editSkillCancel}
            onEditDone={(val) => this._editSkillDone(s, val)}
            onDelete={() => this._deleteSkill(s)}
            initialValue={s.title}
            editBoxRef={this.refs.skillEditBox}
          />
        </div>
      );
    });

    let experience = user.experience.map(e => {
      return (
        <div className="editable" key={e.objectId}>
          <div className="dot" />
          <div className="editable-title">{e.title}</div>
          <button className="editable-action edit" onClick={() => this._editExperience(e)}>
            <div className="editable-icon-bg" />
            <Icon className="editable-icon" svg={require('images/icons/edit.svg')}/>
          </button>
          <button className="editable-action delete" onClick={() => this._deleteExperience(e)}>
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
                <button className="add-skill light primary" onClick={::this._addSkill}>Add new skill</button> :
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
                <button className="light primary" onClick={::this._addExperience}>Add new experience</button> :
                <div className="edit-box">
                  <form onSubmit={::this._doneEditExperience}>
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
                      <button onClick={::this._cancelEditExperience}>Cancel</button>
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

  _onEditAbout(about) {
    UserActions.editAbout(about)
  }

  _addSkill() {
    this.setState({
      editSkills: true,
      skillText: '',
    });
  }

  _editSkillStart() {
    this.setState({
      editSkills: true,
    });
  }

  _editSkillCancel() {
    this.setState({
      editSkills: false,
    });
  }

  _editSkillDone(skill, title) {
    skill.title = title;
    UserActions.editSkill(skill);
    this.setState({
      editSkills: false,
    });
  }

  _deleteSkill(skill) {
    UserActions.deleteSkill(skill);
  }

  _doneEditSkills(event) {
    event.preventDefault();
    if(!this.state.editedSkill) {
      UserActions.addSkill({
        title: this.state.skillText,
      });
    } else {
      let skill = this.state.editedSkill;
      skill.title = this.state.skillText;
      UserActions.editSkill(skill);
    }
    this.setState({
      editSkills: false,
      skillText: '',
      editedSkill: null,
    });
  }

  _cancelEditSkills(event) {
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

  _addExperience() {
    this.setState({editExperience: true});
  }

  _editExperience(exp) {
    this.setState({
      editExperience: true,
      experienceText: exp.title,
      editedExperience: exp,
    });
  }

  _deleteExperience(exp) {
    UserActions.deleteExperience(exp);
  }

  _doneEditExperience(event) {
    event.preventDefault();
    if(!this.state.editedExperience) {
      UserActions.addExperience({
        title: this.state.experienceText,
      });
    } else {
      let exp = this.state.editedExperience;
      exp.title = this.state.experienceText;
      UserActions.editExperience(exp);
    }
    this.setState({
      editExperience: false,
      experienceText: '',
      editedExperience: null,
    });
  }

  _cancelEditExperience(event) {
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
}
