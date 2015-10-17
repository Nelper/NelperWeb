import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedNumber} from 'react-intl';
import {Link} from 'react-router';
import {VelocityComponent} from 'velocity-react';
import classNames from 'classnames';

import SendPaymentMutation from 'actions/payment/SendPaymentMutation';
import {Dialog, Progress} from 'components/index';
import PaymentUtils from 'utils/PaymentUtils';

import styles from './TaskPaymentDialogView.scss';

@cssModules(styles)
class TaskPaymentDialogView extends Component {

  static propTypes = {
    task: PropTypes.object.isRequired,
    opened: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
  }

  state = {
    stripe: PaymentUtils.get(),
    name: '',
    number: '',
    cvc: '',
    expiration: '',
    loading: false,
    completed: false,
  }

  componentDidMount() {
    if (!PaymentUtils.get()) {
      PaymentUtils.load().then(stripe => {
        this.setState({stripe});
      });
    }
  }

  _onNameChanged(event) {
    this.setState({name: event.target.value});
  }

  _onNumberChanged(event) {
    this.setState({number: event.target.value});
  }

  _onCVCChanged(event) {
    this.setState({cvc: event.target.value});
  }

  _onExpirationChanged(event) {
    this.setState({expiration: event.target.value});
  }

  _onClose() {
    this.props.onClose();
  }

  _onPayClick() {
    if (this.state.loading) {
      return;
    }
    this.setState({loading: true});

    const {
      stripe,
      number,
      cvc,
      expiration,
    } = this.state;

    const [expMonth, expYear] = expiration.split('/');

    stripe.card.createToken({
      number,
      cvc,
      exp_month: parseInt(expMonth, 10),
      exp_year: parseInt(expYear, 10),
    }, (status, response) => {
      if (response.error) {
        this.setState({loading: false});
        return;
      }
      Relay.Store.update(
        new SendPaymentMutation({
          task: this.props.task,
          token: response.id,
        }), {
          onFailure: () => {
            this.setState({loading: false});
          },
          onSuccess: () => {
            this.setState({completed: true});
            setTimeout(() => {
              this.props.onSuccess();
            }, 2000);
          },
        }
      );
    });
  }

  render() {
    const {task} = this.props;
    const application = task.acceptedApplication;

    if (!this.state.stripe) {
      return null;
    }
    return (
      <Dialog opened={this.props.opened} onClose={this.props.onClose}>
        <div styleName="module">
          <div styleName="header">
            <div styleName="close-icon" onClick={::this._onClose} />
            <div styleName="nelperpay-logo-container">
              <img src={require('images/icons/nelperpay.png')} styleName="nelperpay-logo" />
            </div>
            <h1 styleName="title">Payment</h1>
            <h3 styleName="subtitle">to {application.user.name}</h3>
          </div>
          <VelocityComponent animation={this.state.completed ? 'slideUp' : 'slideDown'} duration={300}>
            <VelocityComponent animation={{opacity: this.state.completed ? 0 : 1}} duration={300}>
              <div styleName="content">
                <form>
                  <div styleName="cardholder-name">
                    <div styleName="cardholder-name-icon" />
                    <input
                      styleName="icon-input"
                      type="text"
                      placeholder="Cardholder name"
                      value={this.state.name}
                      onChange={::this._onNameChanged}
                    />
                  </div>
                  <div styleName="card-info">
                    <div styleName="card-number">
                      <div styleName="card-number-icon" />
                      <input
                        styleName="icon-input"
                        type="text"
                        placeholder="Card number"
                        size="20"
                        value={this.state.number}
                        onChange={::this._onNumberChanged}
                      />
                    </div>
                    <div styleName="exp-row">
                      <div styleName="exp">
                        <div styleName="exp-icon" />
                        <input
                          styleName="icon-input"
                          type="text"
                          placeholder="MM / YY"
                          size="5"
                          value={this.state.expiration}
                          onChange={::this._onExpirationChanged}
                        />
                      </div>
                      <div styleName="cvc">
                        <div styleName="cvc-icon" />
                        <input
                          styleName="icon-input"
                          type="text"
                          placeholder="CVC"
                          size="3"
                          value={this.state.cvc}
                          onChange={::this._onCVCChanged}
                        />
                      <div styleName="cvc-help-icon" />
                      </div>
                    </div>
                  </div>
                </form>
                <div styleName="button-container">
                  <button styleName="pay-button" className="primary" type="submit" onClick={::this._onPayClick}>
                    <div styleName={this.state.loading ? 'loading-visible' : 'loading'}><Progress inverse small /></div>
                    <div style={{visibility: this.state.loading ? 'hidden' : 'visible'}}>Pay <FormattedNumber value={application.price} style="currency" currency="CAD" /></div>
                  </button>
                  <Link styleName="terms-of-use" to="/termsofuse">Terms of use</Link>
                </div>
              </div>
            </VelocityComponent>
          </VelocityComponent>
          <VelocityComponent animation={this.state.completed ? 'slideDown' : 'slideUp'} duration={300}>
            <VelocityComponent animation={{opacity: this.state.completed ? 1 : 0}} duration={300}>
              <div>
                <div styleName="completed-content">
                  <h2 styleName="completed-title">Payment successfully completed!</h2>
                  <div className={classNames('payment-dialog-checkbox', {'active': this.state.completed})}>
                    <div className="checkbox-check" />
                  </div>
                </div>
              </div>
            </VelocityComponent>
          </VelocityComponent>
        </div>
      </Dialog>
    );
  }
}

export default Relay.createContainer(TaskPaymentDialogView, {
  fragments: {
    task: () => Relay.QL`
      fragment on Task {
        acceptedApplication {
          price,
          user {
            name,
          },
        },
        ${SendPaymentMutation.getFragment('task')},
      }
    `,
  },
});
