import React, {Component, PropTypes} from 'react';

export default class NumericInput extends Component {

  static propTypes = {
    value: PropTypes.number,
    step: PropTypes.number,
    onChange: React.PropTypes.func,
  }

  static defaultProps = {
    value: 0,
    step: 10,
  }

  _onChange(newValue) {
    this.props.onChange && this.props.onChange(newValue);
  }

  render() {
    const {value, step} = this.props;

    return (
      <div className="numeric-input-component">
        <div className="minus-button" onClick={() => this._onChange(value - step)}>-</div>
        <input
          type="number"
          value={this.props.value}
          onChange={(e) => this._onChange(e.target.value)}
        />
        <div className="plus-button" onClick={() => this._onChange(value + step)}>+</div>
      </div>
    );
  }
}
