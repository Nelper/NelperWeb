import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import cssModules from 'react-css-modules';
import {FormattedNumber, FormattedMessage} from 'react-intl';
import {Link} from 'react-router';
import {VelocityComponent} from 'velocity-react';
import InputElement from 'react-input-mask';
import classNames from 'classnames';

import SendPaymentMutation from 'actions/payment/SendPaymentMutation';
import {Dialog, ProgressButton} from 'components/index';
import PaymentUtils from 'utils/PaymentUtils';
import IntlUtils from 'utils/IntlUtils';

import styles from './TaskPaymentDialogView.scss';

@cssModules(styles)
class TaskPaymentDialogView extends Component {

  static propTypes = {
    task: PropTypes.object.isRequired,
    opened: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
  };

  state = {
    stripe: PaymentUtils.get(),
    name: '',
    number: '',
    cvc: '',
    expiration: '',
    error: null,
    loading: false,
    completed: false,
  };

  componentDidMount() {
    if (!PaymentUtils.get()) {
      PaymentUtils.load().then(stripe => {
        this.setState({stripe});
      });
    }
  }

  _onNameChanged(event) {
    this.setState({name: event.target.value, error: null});
  }

  _onNumberChanged(event) {
    this.setState({number: event.target.value, error: null});
  }

  _onCVCChanged(event) {
    this.setState({cvc: event.target.value, error: null});
  }

  _onExpirationChanged(event) {
    this.setState({expiration: event.target.value, error: null});
  }

  _onClose() {
    this.props.onClose();
  }

  _onPayClick() {
    if (this.state.loading) {
      return;
    }

    const {
      stripe,
      name,
      number,
      cvc,
      expiration,
    } = this.state;

    const [expMonth, expYear] = expiration.split('/');

    if (!name.length) {
      this.setState({error: <FormattedMessage id="nelpcenter.taskDetail.paymentErrorName" />});
      return;
    }
    if (!stripe.card.validateCardNumber(number)) {
      this.setState({error: <FormattedMessage id="nelpcenter.taskDetail.paymentErrorCard" />});
      return;
    }
    if (!stripe.card.validateExpiry(expMonth, expYear)) {
      this.setState({error: <FormattedMessage id="nelpcenter.taskDetail.paymentErrorExpiry" />});
      return;
    }
    if (!stripe.card.validateCVC(cvc)) {
      this.setState({error: <FormattedMessage id="nelpcenter.taskDetail.paymentErrorCVC" />});
      return;
    }

    this.setState({loading: true});

    stripe.card.createToken({
      name,
      number,
      cvc,
      exp_month: parseInt(expMonth, 10),
      exp_year: parseInt(expYear, 10),
    }, (status, response) => {
      if (response.error) {
        this.setState({loading: false, error: <FormattedMessage id="nelpcenter.taskDetail.paymentError" />});
        return;
      }
      Relay.Store.update(
        new SendPaymentMutation({
          task: this.props.task,
          token: response.id,
        }), {
          onFailure: () => {
            this.setState({loading: false, error: <FormattedMessage id="nelpcenter.taskDetail.paymentError" />});
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
            <h1 styleName="title"><FormattedMessage id="nelpcenter.taskDetail.paymentTitle" /></h1>
            <h3 styleName="subtitle">
              <FormattedMessage id="nelpcenter.taskDetail.paymentTo" values={{name: application.user.name}} />
            </h3>
          </div>
          <VelocityComponent animation={this.state.completed ? 'slideUp' : 'slideDown'} duration={300}>
            <VelocityComponent animation={{opacity: this.state.completed ? 0 : 1}} duration={300}>
              <div styleName="content">
                <form>
                  <div styleName="cardholder-name">
                    <div styleName="cardholder-name-icon" />
                    <input
                      name="name"
                      styleName="icon-input"
                      type="text"
                      placeholder={IntlUtils.getMessage('nelpcenter.taskDetail.paymentPlaceholderName')}
                      value={this.state.name}
                      onChange={::this._onNameChanged}
                    />
                  </div>
                  <div styleName="card-info">
                    <div styleName="card-number">
                      <div styleName="card-number-icon" />
                      <InputElement
                        name="card_number"
                        styleName="icon-input"
                        type="text"
                        mask="9999 9999 9999 9999"
                        maskChar={null}
                        placeholder={IntlUtils.getMessage('nelpcenter.taskDetail.paymentPlaceholderCard')}
                        value={this.state.number}
                        onChange={::this._onNumberChanged}
                      />
                    </div>
                    <div styleName="exp-row">
                      <div styleName="exp">
                        <div styleName="exp-icon" />
                        <InputElement
                          styleName="icon-input"
                          type="text"
                          mask="99 / 99"
                          maskChar=" "
                          placeholder={IntlUtils.getMessage('nelpcenter.taskDetail.paymentPlaceholderExpiry')}
                          value={this.state.expiration}
                          onChange={::this._onExpirationChanged}
                        />
                      </div>
                      <div styleName="cvc">
                        <div styleName="cvc-icon" />
                        <InputElement
                          styleName="icon-input"
                          mask="999"
                          maskChar={null}
                          type="text"
                          placeholder={IntlUtils.getMessage('nelpcenter.taskDetail.paymentPlaceholderCVC')}
                          size="3"
                          value={this.state.cvc}
                          onChange={::this._onCVCChanged}
                        />
                      <div styleName="cvc-help-icon" />
                      </div>
                    </div>
                  </div>
                </form>
                {
                  <div styleName="error">
                    {this.state.error}
                  </div>
                }
                <div styleName="button-container">
                  <ProgressButton
                    styleName="pay-button"
                    className="primary"
                    type="submit"
                    loading={this.state.loading}
                    onClick={::this._onPayClick}
                  >
                    <FormattedMessage id="nelpcenter.taskDetail.paymentPay" values={{
                      amount: <FormattedNumber value={application.price} style="currency" currency="CAD" />,
                    }}/>
                  </ProgressButton>
                  <Link styleName="terms-of-use" to="/termsofuse">
                    <FormattedMessage id="nelpcenter.taskDetail.paymentTerms" />
                  </Link>
                </div>
              </div>
            </VelocityComponent>
          </VelocityComponent>
          <VelocityComponent animation={this.state.completed ? 'slideDown' : 'slideUp'} duration={300}>
            <VelocityComponent animation={{opacity: this.state.completed ? 1 : 0}} duration={300}>
              <div>
                <div styleName="completed-content">
                  <h2 styleName="completed-title">
                    <FormattedMessage id="nelpcenter.taskDetail.paymentCompleted" />
                  </h2>
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
