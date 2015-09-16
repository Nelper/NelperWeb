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
  }

  static defaultProps = {
    value: 0,
    step: 10,
    disabled: false,
    unit: '',
    max: 99999,
  }

  _onChange(newValue) {
    let value = newValue;

    // Makes sure the value is within the max range and not negative.
    if (value < 0) value = 0;
    if (value > this.props.max) value = this.props.max;

    this.props.onChange && this.props.onChange(value);
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
        <div styleName="minus-button" onClick={() => this._onChange(value - step)}>-</div>
        <div styleName="input-container" onClick={::this._onContainerClick}>
          <div style={{width: this.props.value.toString().length * CHAR_WIDTH}}>
            <input
              styleName="input"
              ref="input"
              type="number"
              min={0}
              max={max}
              value={this.props.value}
              onChange={(e) => this._onChange(parseInt(e.target.value, 10) || 0)}
            />
          </div>
          <div styleName="unit">{unit}</div>
        </div>
        <div styleName="plus-button" onClick={() => this._onChange(value + step)}>+</div>
      </div>
    );
  }
}
