import React, {Component} from 'react';

export default class Progress extends Component {

  static propTypes = {
    rating: React.PropTypes.number,
  }

  render() {
    return (
      <div className="progress">
        <div className="bubble-container">
          <div className="bubble" />
        </div>
        <div className="bubble-container">
          <div className="bubble" />
        </div>
        <div className="bubble-container">
          <div className="bubble" />
        </div>
      </div>
    );
  }
}
