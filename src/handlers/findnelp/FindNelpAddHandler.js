import React, {Component} from 'react';

import AddLocationDialogView from './AddLocationDialogView';
import FindNelpActions from 'actions/FindNelpActions';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';

export default class FindNelpAddHandler extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  state = {
    category: '',
    title: '',
    amount: '',
    desc: '',
    location: null,
    openCreateLocation: false,
    locations: [],
  }

  render() {
    let categories = TaskCategoryUtils.list().map(c => {
      let active = this.state.category === c;
      let activeColor = TaskCategoryUtils.getDarkColor(c).hexString();
      return (
        <div key={c} className="category" onClick={() => this._selectCategory(c)}>
          <div className="icon" style={{
            backgroundImage: `url('${TaskCategoryUtils.getImage(c)}')`,
            borderColor: active ? activeColor : 'transparent',
          }}>
            <div className="overlay" />
          </div>
          <div className="title" style={{
            color: active ? activeColor : null,
            fontWeight: active ? 'bold' : null,
          }}>{TaskCategoryUtils.getName(c)}</div>
        </div>
      );
    });

    let locations = this.state.locations.map((l, i) => {
      return (
        <option value={i} selected={l === this.state.location}>{l.name}</option>
      );
    });

    return (
      <div id="find-nelp-add-handler" className="container pad-all">
        <AddLocationDialogView
          opened={this.state.openCreateLocation}
          onLocationAdded={::this._onAddLocation}
          onCancel={::this._onCancelAddLocation} />
        <form onSubmit={::this._onSubmit}>
          <div className="input-row">
            <div className="step">1</div>
            <div className="input-content">
              <label className="title">Select your Task Category</label>
              <div className="category-picker">{categories}</div>
            </div>
          </div>
          <div className="input-row">
            <div className="step">2</div>
            <div className="input-content">
              <label className="title">Enter your Task Title</label>
              <input
                type="text"
                required={true}
                maxLength={72}
                value={this.state.title}
                onChange={this._onTitleChanged.bind(this)} />
            </div>
          </div>
          <div className="input-row">
            <div className="step">3</div>
            <div className="input-content">
              <label className="title">How much are you offering?</label>
              <div className="price">
                <div className="currency">$</div>
                <input
                  type="number"
                  required={true}
                  value={this.state.priceOffered}
                  onChange={this._onPriceOfferedChanged.bind(this)} />
              </div>
            </div>
          </div>
          <div className="input-row">
            <div className="step">4</div>
            <div className="input-content">
              <label className="title">Select your location</label>
              <div className="location">
                {
                  locations.length ?
                  <select onChange={::this._onLocationChanged}>
                    {locations}
                  </select> :
                  null
                }
                <button className="blue" onClick={::this._onOpenAddLocation}>Add</button>
              </div>
            </div>
          </div>
          <div className="input-row">
            <div className="step">5</div>
            <div className="input-content">
              <label className="title">Briefly describe what you are looking for</label>
              <textarea
                required={true}
                value={this.state.desc}
                onChange={this._onDescChanged.bind(this)} />
            </div>
          </div>
          <div className="input-row">
            <div className="step">6</div>
            <div className="input-content">
              <label className="title">Attach pictures (optional)</label>
              <input type="file" />
            </div>
          </div>
          <div className="btn-group">
            <button
              type="submit"
              className="primary">Create</button>
            <button onClick={this._cancel.bind(this)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  _selectCategory(c) {
    this.setState({category: c});
  }

  _onOpenAddLocation(event) {
    event.preventDefault();
    this.setState({openCreateLocation: true});
  }

  _onAddLocation(location) {
    let newLocations = this.state.locations;
    newLocations.push(location);
    this.setState({
      openCreateLocation: false,
      locations: newLocations,
      location: location,
    });
  }

  _onCancelAddLocation() {
    this.setState({openCreateLocation: false});
  }

  _onLocationChanged(event) {
    let location = this.state.locations[event.target.selectedIndex];
    this.setState({
      location,
    });
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

  _validate() {
    let {title, category, location} = this.state;
    return title && category && location;
  }

  _onSubmit(e) {
    e.preventDefault();

    if(!this._validate()) {
      return;
    }

    FindNelpActions.addTask({
      title: this.state.title,
      category: this.state.category,
      desc: this.state.desc,
      priceOffered: this.state.priceOffered,
      location: this.state.location.coords,
    });
    this.context.router.goBack();
  }

  _cancel() {
    this.context.router.goBack();
  }
}
