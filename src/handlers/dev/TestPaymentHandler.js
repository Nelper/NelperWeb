import React, {Component} from 'react';

import PaymentUtils from 'utils/PaymentUtils';
import CreateChargeForApplicationMutation from 'actions/payment/CreateChargeForApplicationMutation';
import CreateStripeAccountMutation from 'actions/payment/CreateStripeAccountMutation';

export default class TestPaymentHandler extends Component {

  state = {
    stripe: PaymentUtils.get(),
    number: '',
    cvc: '',
    expMonth: 0,
    expYear: 0,
  };

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

  _onNumberChanged(event) {
    this.setState({number: event.target.value});
  }

  _onCVCChanged(event) {
    this.setState({cvc: event.target.value});
  }

  _onExpMonthChanged(event) {
    this.setState({expMonth: event.target.value});
  }

  _onExpYearChanged(event) {
    this.setState({expYear: event.target.value});
  }

  render() {
    if (!this.state.stripe) {
      return null;
    }
    return (
      <div className="test-payment-handler">
        <div className="container pad-all tasks">
          <form className="payment-form" onSubmit={::this._onSubmit}>
            <span className="payment-errors"></span>

            <div className="form-row">
              <label>
                <span>Card Number</span>
                <input
                  type="text"
                  size="20"
                  value={this.state.number}
                  onChange={::this._onNumberChanged}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>CVC</span>
                <input
                  type="text"
                  size="4"
                  value={this.state.cvc}
                  onChange={::this._onCVCChanged}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                <span>Expiration (MM/YYYY)</span>
                <input
                  type="text"
                  size="2"
                  value={this.state.expMonth}
                  onChange={::this._onExpMonthChanged}
                />
              </label>
              <span> / </span>
              <input
                type="text"
                size="4"
                value={this.state.expYear}
                onChange={::this._onExpYearChanged}
              />
            </div>

            <button type="submit">Submit Payment</button>
          </form>
        </div>
      </div>
    );
  }
}
