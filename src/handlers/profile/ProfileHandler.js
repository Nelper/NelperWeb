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
    editSkills: false,
    skillText: '',
    editedSkill: null,
  }

  render() {
    let {user} = this.props;

    let skills = user.skills.map(s => {
      return (
        <div className="skill">
          <div className="title">{s.title}</div>
          <button className="secondary" onClick={() => this._editSkill(s)}>Edit</button>
          <button className="warning" onClick={() => this._deleteSkill(s)}>Delete</button>
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
        <div className="tabs" />
        <div className="container pad-all">
          <div className="section-row">
            <div className="title">
              About
            </div>
            <div className="content">
              {user.about}
            </div>
          </div>
          <div className="section-row">
            <div className="title">
              Skills
            </div>
            <div className="content">
              <div className="skills">
                {skills}
              </div>
              {
                !this.state.editSkills ?
                <button className="add-skill" onClick={::this._addSkill}>Add new skill</button> :
                <div className="add-skill-form">
                  <form onSubmit={::this._doneEditSkills}>
                    <p>Enter something you are good at</p>
                    <input
                      type="text"
                      value={this.state.skillText}
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
        </div>
      </div>
    );
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
