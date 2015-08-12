import React, {Component} from 'react';
import moment from 'moment';
import connectToStores from 'alt/utils/connectToStores';

import UserActions from 'actions/UserActions';
import UserStore from 'stores/UserStore';
import Rating from 'components/Rating';
import ApiUtils from 'utils/ApiUtils';

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
    editAbout: false,
    aboutText: '',
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
        <div className="skill editable-row" key={s.objectId}>
          <div className="checkmark" />
          <div className="title">{s.title}</div>
          <button className="action edit" onClick={() => this._editSkill(s)} />
          <button className="action delete" onClick={() => this._deleteSkill(s)} />
        </div>
      );
    });

    let experience = user.experience.map(e => {
      return (
        <div className="editable-row" key={e.objectId}>
          <div className="dot" />
          <div className="title">{e.title}</div>
          <button className="action edit" onClick={() => this._editExperience(e)} />
          <button className="action delete" onClick={() => this._deleteExperience(e)} />
        </div>
      );
    });

    return (
      <div id="profile-handler">
        <div className="header">
          <div className="container pad-all">
            <div className="picture-picker">
              <div
                style={{backgroundImage: `url('${user.pictureURL}')`}}
                className="picture" />
              <input type="file" onChange={::this._uploadPicture} />
            </div>
            <div className="info-container">
              <div className="user-name">
                {user.name}
              </div>
              <Rating rating={4}/>
              <div className="member-since">
                Member since {moment(user.createdAt).format('MMMM Do YYYY')}
              </div>
              <div className="tasks-summary">8 Tasks Completed</div>
            </div>
            <div>
            <div className="btn-group">
              <button className="secondary" onClick={::this._settings}>Settings</button>
              <button className="secondary" onClick={::this._logout}>Logout</button>
            </div>
            </div>
          </div>
        </div>
        <div className="container pad-all">
          <div className="section-row">
            <div className="section-title">
              About
            </div>
            <div className="content">
              {
                !this.state.editAbout ?
                <div className="about editable-row">
                  <div className="title">{user.about || 'Write something about you'}</div>
                  <button className="action edit" onClick={::this._editAbout}/>
                </div> :
                <div className="edit-box">
                  <form onSubmit={::this._doneEditAbout}>
                    <textarea
                      placeholder="Write something about you..."
                      value={this.state.aboutText}
                      onChange={::this._onAboutTextChanged} />
                    <div className="btn-group">
                      <button type="submit" className="primary">OK</button>
                      <button onClick={::this._cancelEditAbout}>Cancel</button>
                    </div>
                  </form>
                </div>
              }
            </div>
          </div>
          <div className="section-row">
            <div className="section-title">
              Skills
            </div>
            <div className="content">
              <div className="skills">
                {skills}
              </div>
              {
                !this.state.editSkills ?
                <button className="add-skill light primary" onClick={::this._addSkill}>Add new skill</button> :
                <div className="edit-box">
                  <form onSubmit={::this._doneEditSkills}>
                    <input
                      type="text"
                      placeholder="Enter something you are good at"
                      value={this.state.skillText}
                      maxLength={30}
                      required={true}
                      onChange={::this._onSkillTextChanged} />
                    <div className="btn-group">
                      <button type="submit" className="primary">OK</button>
                      <button onClick={::this._cancelEditSkills}>Cancel</button>
                    </div>
                  </form>
                </div>
              }
            </div>
          </div>
          <div className="section-row">
            <div className="section-title">
              Experience
            </div>
            <div className="content">
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

  _editAbout() {
    this.setState({
      aboutText: this.props.user.about,
      editAbout: true,
    });
  }

  _doneEditAbout(event) {
    event.preventDefault();

    UserActions.editAbout(this.state.aboutText);

    this.setState({
      editAbout: false,
    });
  }

  _cancelEditAbout(event) {
    event.preventDefault();
    this.setState({
      editAbout: false,
    });
  }

  _onAboutTextChanged(event) {
    this.setState({aboutText: event.target.value});
  }

  _addSkill() {
    this.setState({editSkills: true});
  }

  _editSkill(skill) {
    this.setState({
      editSkills: true,
      skillText: skill.title,
      editedSkill: skill,
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

  _logout() {
    UserActions.logout();
    this.context.router.transitionTo('/');
  }

  _settings() {
    this.context.router.transitionTo('/profile/settings');
  }

  _uploadPicture() {
    let files = event.target.files;
    if(files.length > 0) {
      let file = files[0];
      ApiUtils.uploadFile(file.name, file)
        .then(f => {
          UserActions.setPicture(f);
        });
    }
  }
}
