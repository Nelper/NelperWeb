import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {FormattedMessage, FormattedDate} from 'react-intl';
import cssModules from 'react-css-modules';

import {Rating} from 'components/index';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';

import styles from './UserProfileView.scss';

@cssModules(styles)
class UserProfileView extends Component {

  static propTypes = {
    user: PropTypes.object,
  };

  render() {
    const user = this.props.user;

    const skills = user.skills.map(s => {
      return (
        <div styleName="skill" key={s.objectId}>
          {s.title}
        </div>
      );
    });

    const education = user.education.map(e => {
      return (
        <div key={e.objectId}>
          {e.title}
        </div>
      );
    });

    const experience = user.experience.map(e => {
      return (
        <div key={e.objectId}>
          {e.title}
        </div>
      );
    });

    let feedback = null;
    if (user.feedback) {
      if (user.feedback.edges.length) {
        feedback = user.feedback.edges.map((edge, i) => {
          const f = edge.node;
          return (
            <div styleName="feedback-item" key={i}>
              <div styleName="feedback-header">
                <div styleName="feedback-category" style={{backgroundImage: `url('${TaskCategoryUtils.getImage(f.task.category)}')`}} />
                <div styleName="feedback-username">{f.poster.name}</div>
              </div>
              <div styleName="feedback-content">
                <div styleName="feedback-rating"><Rating rating={f.rating} dark /></div>
                <div styleName="feedback-text">{f.content}</div>
                <div styleName="feedback-date"><FormattedDate value={f.createdAt} /></div>
              </div>
            </div>
          );
        });
      } else {
        feedback = <div><FormattedMessage id="profile.noFeedback" /></div>;
      }
    }

    return (
      <div styleName="module" className="container">
        <div styleName="section-row" className="panel pad-all">
          <div styleName="section-title">
            <div styleName="section-icon-about" />
            <div><FormattedMessage id="profile.about" /></div>
          </div>
          <div styleName="section-content">
            {user.about}
          </div>
        </div>
        <div styleName="section-row" className="panel pad-all">
          <div styleName="section-title">
            <div styleName="section-icon-skills" />
            <div><FormattedMessage id="profile.skills" /></div>
          </div>
          <div styleName="section-content">
            <div styleName="skills">
              {skills}
            </div>
          </div>
        </div>
        <div styleName="section-row" className="panel pad-all">
          <div styleName="section-title">
            <div styleName="section-icon-education" />
            <div><FormattedMessage id="profile.education" /></div>
          </div>
          <div styleName="section-content">
            <div>
              {education}
            </div>
          </div>
        </div>
        <div styleName="section-row" className="panel pad-all">
          <div styleName="section-title">
            <div styleName="section-icon-work" />
            <div><FormattedMessage id="profile.experience" /></div>
          </div>
          <div styleName="section-content">
            <div>
              {experience}
            </div>
          </div>
        </div>
        <div styleName="section-row" className="panel pad-all">
          <div styleName="section-title">
            <div styleName="section-icon-feedback" />
            <div><FormattedMessage id="profile.feedback" /></div>
          </div>
          <div styleName="section-content">
            <div styleName="feedback">
              {feedback}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(UserProfileView, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        about,
        skills {
          title,
        },
        experience{
          title,
        },
        education {
          title,
        },
        feedback(first: 20) {
          edges {
            node {
              createdAt,
              rating,
              content,
              poster {
                name,
              },
              task {
                category,
              },
            }
          }
        }
      }
    `,
  },
});
