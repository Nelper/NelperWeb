import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class NumericInput extends Component {

  static propTypes = {
    value: PropTypes.number,
    step: PropTypes.number,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    value: 0,
    step: 10,
    disabled: false,
  }

  _onChange(newValue) {
    this.props.onChange && this.props.onChange(newValue);
  }

  render() {
    const {value, step} = this.props;

    return (
      <div className={classNames('numeric-input-component', {'disabled': this.props.disabled})}>
        <div className="minus-button" onClick={() => this._onChange(value - step)}>-</div>
        <input
          type="number"
          value={this.props.value}
          onChange={(e) => this._onChange(parseInt(e.target.value, 10))}
        />
        <div className="plus-button" onClick={() => this._onChange(value + step)}>+</div>
      </div>
    );
  }
}
