import React, {Component, PropTypes} from 'react';

import Icon from './Icon';

export class EditableBox extends Component {

  static propTypes = {
    multiline: PropTypes.bool,
    type: PropTypes.string,
    onEditCancel: PropTypes.func,
    onEditDone: PropTypes.func,
    initialValue: PropTypes.string,
  }

  static defaultProps = {
    multiline: false,
    type: 'text',
    initialValue: '',
    onEditDone: () => {},
    onEditCancel: () => {},
  }

  state = {
    editValue: this.props.initialValue,
  }

  _onDoneEdit(event) {
    event.preventDefault();
    const newValue = this.state.editValue;
    this.props.onEditDone(newValue);
  }

  _onCancel(event) {
    event.preventDefault();
    this.setState({
      editValue: this.props.initialValue,
    });
    this.props.onEditCancel();
  }

  _onEditValueChanged(event) {
    this.setState({
      editValue: event.target.value,
    });
  }

  render() {
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
}

/**
 * Editable and deletable text element.
 */
export default class Editable extends Component {

  static propTypes = {
    autoEditBox: PropTypes.bool,
    multiline: PropTypes.bool,
    type: PropTypes.string,
    deletable: PropTypes.bool,
    value: PropTypes.string,
    onEditStart: PropTypes.func,
    onEditCancel: PropTypes.func,
    onEditDone: PropTypes.func,
    onDelete: PropTypes.func,
    children: PropTypes.node,
  }

  static defaultProps = {
    autoEditBox: true,
    deletable: false,
    value: '',
    onEditStart: () => {},
    onDelete: () => {},
    onEditDone: () => {},
    onEditCancel: () => {},
  }

  state = {
    editing: false,
    value: this.props.value,
  }

  componentWillReceiveProps(newProps) {
    this.setState({value: newProps.value});
  }

  _onEdit() {
    this.setState({
      editing: true,
    });
    this.props.onEditStart();
  }

  _onDelete() {
    this.props.onDelete();
  }

  _onDoneEdit(newValue) {
    this.setState({
      editing: false,
      value: newValue,
    });
    this.props.onEditDone(newValue);
  }

  _onCancel() {
    this.setState({
      editing: false,
    });
    this.props.onEditCancel();
  }

  render() {
    return (
      <div className="editable-component">
      {
        !this.state.editing ?
        <div className="editable">
          <div className="editable-text">
            {
              this.props.children || this.state.value
            }
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
        </div> :
        null
      }
      {
        this.state.editing && this.props.autoEditBox ?
        <EditableBox
          multiline={this.props.multiline}
          type={this.props.type}
          onEditDone={::this._onDoneEdit}
          onEditCancel={::this._onCancel}
          initialValue={this.props.value}
        /> :
        null
      }
      </div>
    );
  }
}
