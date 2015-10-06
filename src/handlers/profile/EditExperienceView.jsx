import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';

import {EditExperienceMutation} from 'actions/profile/index';
import Editable, {EditableBox} from 'components/Editable';

import styles from './EditExperienceView.scss';

@cssModules(styles)
class EditExperienceView extends Component {

  static propTypes = {
    me: PropTypes.object.isRequired,
  }

  state = {
    addingExperience: false,
  }

  _onAddExperience() {
    this.setState({
      addingExperience: true,
    });
  }

  _onAddExperienceDone(title) {
    const experience = [...this.props.me.experience, {title}];
    Relay.Store.update(
      new EditExperienceMutation({
        me: this.props.me,
        experience,
      }),
    );
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
    Relay.Store.update(
      new EditExperienceMutation({
        me: this.props.me,
        experience: this.props.me.experience,
      }),
    );
  }

  _onDeleteExperience(exp) {
    const experience = this.props.me.experience.filter(e => e !== exp);
    Relay.Store.update(
      new EditExperienceMutation({
        me: this.props.me,
        experience,
      }),
    );
  }

  render() {
    const {me} = this.props;

    const experience = me.experience.map((e, i) => {
      return (
        <div key={i}>
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
      <div styleName="module" className="panel pad-all profile-section-row">
        <div className="profile-section-title">
          <div styleName="icon" className="profile-section-icon" />
          <div>Work experience</div>
        </div>
        <div className="profile-section-content">
          <div>
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
    );
  }
}

export default Relay.createContainer(EditExperienceView, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        experience {
          title,
        },
        ${EditExperienceMutation.getFragment('me')},
      }
    `,
  },
});
