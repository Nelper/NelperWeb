import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import {FormattedMessage} from 'react-intl';
import cssModules from 'react-css-modules';

import {
  Dialog,
  Rating,
  AnimatedCheck,
} from 'components/index';

import styles from './ConfirmAcceptNelperDialogView.scss';

@cssModules(styles)
class ConfirmAcceptNelperDialogView extends Component {

  static propTypes = {
    application: PropTypes.object,
    opened: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    confirmed: false,
  };

  _onConfirmAccept() {
    this.setState({confirmed: true});
    setTimeout(() => {
      this.props.onConfirm();
      this.setState({confirmed: false});
    }, 1000);
  }

  render() {
    const {application} = this.props;

    return (
      <Dialog className="pad-all" opened={this.props.opened} onClose={this.props.onClose}>
        {
          application ?
          <div styleName="accept-dialog">
            {
              !this.state.confirmed ?
              <h1 styleName="accept-title">
                <FormattedMessage id="nelpcenter.taskDetail.confirmAcceptTitle" />
              </h1> :
              null
            }
            <div className="dialog-content">
              <div styleName="accept-user">
                <div styleName="accept-picture" style={{backgroundImage: `url('${application.user.pictureURL}')`}} />
                <div styleName="accept-infos">
                  <div styleName="accept-name">{application.user.name}</div>
                  <Rating rating={application.user.rating} number={application.user.tasksCompleted} dark small />
                </div>
              </div>
            </div>
            {
              !this.state.confirmed ?
              <div className="btn-group">
                <button onClick={this.props.onClose}>
                  <FormattedMessage id="common.cancel"/>
                </button>
                <button onClick={::this._onConfirmAccept} className="primary">
                  <FormattedMessage id="common.accept"/>
                </button>
              </div> :
              <div styleName="nelper-accepted">
                <AnimatedCheck />
                <div styleName="nelper-accepted-text">
                  <FormattedMessage id="nelpcenter.taskDetail.confirmNelperAccepted" />
                </div>
              </div>
            }
          </div> :
          null
        }
      </Dialog>
    );
  }
}

export default Relay.createContainer(ConfirmAcceptNelperDialogView, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        user {
          name,
          pictureURL,
          rating,
          tasksCompleted,
        },
      }
    `,
  },
});
