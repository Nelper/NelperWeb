import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';

import {EditSkillsMutation} from 'actions/profile/index';
import Editable, {EditableBox} from 'components/Editable';

import styles from './EditSkillsView.scss';

@cssModules(styles)
class EditSkillsView extends Component {

  static propTypes = {
    me: PropTypes.object.isRequired,
  }

  state = {
    addingSkill: false,
  }

  _onAddSkill() {
    this.setState({
      addingSkill: true,
    });
  }

  _onAddSkillDone(title) {
    const skills = [...this.props.me.skills, {title}];
    Relay.Store.update(
      new EditSkillsMutation({
        me: this.props.me,
        skills,
      }),
    );
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
    Relay.Store.update(
      new EditSkillsMutation({
        me: this.props.me,
        skills: this.props.me.skills,
      }),
    );
  }

  _onDeleteSkill(skill) {
    const skills = this.props.me.skills.filter(s => s !== skill);
    Relay.Store.update(
      new EditSkillsMutation({
        me: this.props.me,
        skills,
      }),
    );
  }

  render() {
    const {me} = this.props;

    const skills = me.skills.map((s, i) => {
      return (
        <div key={i} styleName="skill">
          <Editable
            deletable
            onEditDone={(val) => this._onEditSkillDone(s, val)}
            onDelete={() => this._onDeleteSkill(s)}
            value={s.title}
          />
        </div>
      );
    });

    return (
      <div styleName="module" className="panel pad-all profile-section-row">
        <div className="profile-section-title">
          <div styleName="icon" className="profile-section-icon" />
          <div>Skills</div>
        </div>
        <div className="profile-section-content">
          <div styleName="skills">
            {skills}
          </div>
          {
            !this.state.addingSkill ?
            <button className="link-button" onClick={::this._onAddSkill}>Add skill</button> :
            <EditableBox
              onEditDone={::this._onAddSkillDone}
              onEditCancel={::this._onAddSkillCancel}
            />
          }
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(EditSkillsView, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        skills {
          title,
        },
        ${EditSkillsMutation.getFragment('me')},
      }
    `,
  },
});
