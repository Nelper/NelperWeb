import React, {Component} from 'react';

import UserStore from 'stores/UserStore';
import FindNelpActions from 'actions/FindNelpActions';

export default class FindNelpAddHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    title: '',
    amount: '',
    desc: '',
  }

  render() {
    return (
      <div id="find-nelp-add-handler" className="container pad-all">
        <h2>Ask for Nelp</h2>
        <input
          type='text'
          value={this.state.title}
          placeholder='Title'
          onChange={this._onTitleChanged.bind(this)} />
        <h3>Select a Category</h3>
        <div className="categories">
          <div className="category active">Technology</div>
          <div className="category">Gardening</div>
          <div className="category">Handyman</div>
          <div className="category">Cooking</div>
          <div className="category">Housecleaning</div>
        </div>
        <h3>How much are you paying?</h3>
        <input
          type='text'
          value={this.state.priceOffered}
          placeholder='amount'
          onChange={this._onPriceOfferedChanged.bind(this)} />
        <h3>Enter your Postal Code</h3>
        <input
          type='text'
          value={this.state.postalCode}
          placeholder='postal code'
          onChange={this._onPostalCodeChanged.bind(this)} />
        <h3>Briefly describe what you are looking for</h3>
        <textarea
          value={this.state.desc}
          placeholder='Description'
          onChange={this._onDescChanged.bind(this)} />
        <div className="btn-group">
          <button
            className="primary"
            disabled={!this.state.title || !this.state.desc}
            onClick={this._create.bind(this)}>Create</button>
          <button onClick={this._cancel.bind(this)}>Cancel</button>
        </div>
      </div>
    );
  }

  _onTitleChanged(event) {
    this.setState({
      title: event.target.value,
    });
  }

  _onPriceOfferedChanged(event) {
    this.setState({
      priceOffered: event.target.value,
    });
  }

  _onPostalCodeChanged(event) {
    this.setState({
      postalCode: event.target.value,
    });
  }

  _onDescChanged(event) {
    this.setState({
      desc: event.target.value,
    });
  }

  _create() {
    FindNelpActions.addTask({
      title: this.state.title,
      desc: this.state.desc,
      priceOffered: this.state.priceOffered,
      state: 0,
      location: UserStore.state.user.location,
    });
    this.context.router.goBack();
  }

  _cancel() {
    this.context.router.goBack();
  }
}
