import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import {FormattedNumber} from 'react-intl';
import {Link} from 'react-router';

import {Dialog, Progress} from 'components/index';
import PaymentUtils from 'utils/PaymentUtils';

import styles from './TaskPaymentDialogView.scss';

@cssModules(styles)
export default class TaskPaymentDialogView extends Component {

  static propTypes = {
    task: PropTypes.object.isRequired,
    opened: PropTypes.bool,
    onClose: PropTypes.func,
  }

  state = {
    stripe: PaymentUtils.get(),
    name: '',
    number: '',
    cvc: '',
    expMonth: 0,
    expYear: 0,
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

  _onSubmit(event) {
    event.preventDefault();

    const {
      stripe,
      number,
      cvc,
      expMonth,
      expYear,
    } = this.state;

    stripe.card.createToken({
      number,
      cvc,
      exp_month: expMonth,
      exp_year: expYear,
    }, (status, response) => {

    });
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
    this.props.onClose && this.props.onClose();
  }

  _onPayClick() {
    if (this.state.loading) {
      return;
    }
    this.setState({loading: true});
    setTimeout(() => this.setState({completed: true}), 3000);
  }

  render() {
    const {task} = this.props;
    const application = task.applications.accepted;

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
          {
            !this.state.completed ?
            <div styleName="content">
              <form onSubmit={::this._onSubmit}>
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
            </div> :
            <div styleName="completed-content">
              <h2 styleName="completed-title">Payment successfully completed!</h2>
                <div className="checkbox">
                  <input type="checkbox" id="cb" name="cb" />
                  <label />
                </div>
            </div>
          }
        </div>
      </Dialog>
    );
  }
}
