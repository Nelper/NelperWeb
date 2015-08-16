import React, {Component, PropTypes} from 'react';

import Icon from './Icon';

/**
 * Editable and deletable text element.
 */
export default class Editable extends Component {

  static propTypes = {
    multiline: PropTypes.bool,
    type: PropTypes.string,
    deletable: PropTypes.bool,
    editBoxRef: PropTypes.object,
    initialValue: PropTypes.string,
    onEditStart: PropTypes.func,
    onEditCancel: PropTypes.func,
    onEditDone: PropTypes.func,
    onDelete: PropTypes.func,
  }

  static defaultProps = {
    multiline: false,
    type: 'text',
    deletable: false,
    editBoxRef: null,
    initialValue: '',
  }

  state = {
    editing: false,
    value: this.props.initialValue,
    editValue: '',
  }

  componentDidUpdate() {
    const boxRef = this.props.editBoxRef || this.refs.editBox;
    if (this.state.editing) {
      React.render(this._renderEditBox(), boxRef.getDOMNode());
    } else {
      React.render(<div />, boxRef.getDOMNode());
    }
  }

  _onEditValueChanged(event) {
    this.setState({
      editValue: event.target.value,
    });
  }

  _onDoneEdit(event) {
    event.preventDefault();
    const newValue = this.state.editValue;
    this.setState({
      editing: false,
      value: newValue,
      editValue: '',
    });
    this.props.onEditDone && this.props.onEditDone(newValue);
  }

  _onCancel(event) {
    event.preventDefault();
    this.setState({
      editing: false,
      editValue: '',
    });
    this.props.onEditCancel && this.props.onEditCancel();
  }

  _onEdit() {
    this.setState({
      editing: true,
      editValue: this.state.value,
    });
    this.props.onEditStart && this.props.onEditStart();
  }

  _onDelete() {
    this.props.onDelete && this.props.onDelete();
  }

  _renderEditBox() {
    const input = this.props.multiline ?
      <textarea
        value={this.state.editValue}
        onChange={::this._onEditValueChanged}
      /> :
      <input
        type={this.props.type}
        value={this.state.editValue}
        onChange={::this._onEditValueChanged}
      />;

    return (
      <div className="edit-box-component">
        <form onSubmit={::this._onDoneEdit}>
          {input}
          <div className="btn-group">
            <button className="primary" type="submit">OK</button>
            <button onClick={::this._onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  render() {
    return (
      <div className="editable-component">
        <div className="editable">
          <div className="editable-text">
            {this.state.value}
          </div>
          <button className="editable-action" onClick={::this._onEdit}>
            <div className="editable-icon-bg" />
            <Icon className="editable-icon" svg={require('images/icons/edit.svg')}/>
          </button>
          {
            this.props.deletable ?
            <button className="editable-action" onClick={::this._onDelete}>
              <div className="editable-icon-bg" />
              <Icon className="editable-icon" svg={require('images/icons/delete.svg')}/>
            </button> :
            null
          }
        </div>
        <div ref="editBox" />
      </div>
    );
  }
}
