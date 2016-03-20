import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedMessage} from 'react-intl';

import {EditEducationMutation} from 'actions/profile/index';
import Editable, {EditableBox} from 'components/Editable';

import styles from './EditEducationView.scss';

@cssModules(styles)
class EditEducationView extends Component {

  static propTypes = {
    me: PropTypes.object.isRequired,
  };

  state = {
    addingEducation: false,
  };

  _onAddEducation() {
    this.setState({
      addingEducation: true,
    });
  }

  _onAddEducationDone(title) {
    const education = [...this.props.me.education, {title}];
    Relay.Store.update(
      new EditEducationMutation({
        me: this.props.me,
        education,
      }),
    );
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
    Relay.Store.update(
      new EditEducationMutation({
        me: this.props.me,
        education: this.props.me.education,
      }),
    );
  }

  _onDeleteEducation(ed) {
    const education = this.props.me.education.filter(e => e !== ed);
    Relay.Store.update(
      new EditEducationMutation({
        me: this.props.me,
        education,
      }),
    );
  }

  render() {
    const {me} = this.props;

    const education = me.education.map((e, i) =>
      <div className="education" key={i}>
        <Editable
          deletable
          onEditDone={(val) => this._onEditEducationDone(e, val)}
          onDelete={() => this._onDeleteEducation(e)}
          value={e.title}
        />
      </div>
    );

    return (
      <div styleName="module" className="panel pad-all profile-section-row">
        <div className="profile-section-title">
          <div styleName="icon" className="profile-section-icon" />
          <div>
            <FormattedMessage id="profile.education" />
          </div>
        </div>
        <div className="profile-section-content">
          <div className="education">
            {education}
          </div>
          {
            !this.state.addingEducation ?
            <button className="link-button" onClick={::this._onAddEducation}>
              <FormattedMessage id="profile.addEducation" />
            </button> :
            <EditableBox
              onEditDone={::this._onAddEducationDone}
              onEditCancel={::this._onAddEducationCancel}
            />
          }
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(EditEducationView, {
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        education {
          title,
        },
        ${EditEducationMutation.getFragment('me')},
      }
    `,
  },
});
