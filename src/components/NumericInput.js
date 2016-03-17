import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import classNames from 'classnames';

import styles from './NumericInput.scss';

@cssModules(styles, {allowMultiple: true})
export default class NumericInput extends Component {

  static propTypes = {
    value: PropTypes.number,
    step: PropTypes.number,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    unit: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
  };

  static defaultProps = {
    value: 0,
    step: 10,
    disabled: false,
    unit: '',
    min: 0,
    max: 99999,
    onChange: () => {},
  };

  _onChange(newValue, checkMin) {
    let value = newValue;

    // Makes sure the value is within the max range and not negative.
    if (checkMin && value < this.props.min) value = this.props.min;
    if (value > this.props.max) value = this.props.max;

    this.props.onChange(value);
  }

  _onBlur() {
    if (this.props.value < this.props.min) {
      this.props.onChange(this.props.min);
    }
  }

  _onContainerClick() {
    this.refs.input.focus();
  }

  render() {
    const {value, step, unit, max} = this.props;

    // Approximate width of a caracter to calculate the width of the input.
    const CHAR_WIDTH = 10;

    return (
      <div styleName={classNames('numeric-input', {'disabled': this.props.disabled})}>
        <div styleName="minus-button" onClick={() => this._onChange(value - step, true)}>-</div>
        <div styleName="input-container" onClick={::this._onContainerClick}>
          <div style={{width: this.props.value.toString().length * CHAR_WIDTH}}>
            <input
              styleName="input"
              ref="input"
              type="number"
              min={0}
              max={max}
              value={this.props.value}
              onChange={(e) => this._onChange(parseInt(e.target.value, 10) || 0, false)}
              onBlur={::this._onBlur}
            />
          </div>
          <div styleName="unit">{unit}</div>
        </div>
        <div styleName="plus-button" onClick={() => this._onChange(value + step, true)}>+</div>
      </div>
    );
  }
}
