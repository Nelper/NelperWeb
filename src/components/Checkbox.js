import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class Checkbox extends Component {

  static propTypes = {
    selected: PropTypes.bool,
    onCheck: PropTypes.func,
    title: PropTypes.node,
  }

  static defaultProps = {
    onCheck: () => {},
  }

  _onCheck() {
    this.props.onCheck(!this.props.selected);
  }

  render() {
    return (
      <div
        className={classNames('checkbox-component', {'checked': this.props.selected})}
        onClick={::this._onCheck}
      >
        {this.props.title}
      </div>
    );
  }
}
