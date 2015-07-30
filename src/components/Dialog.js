import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class Collapse extends Component {

  static propTypes: {
    opened: PropTypes.boolean,
  }

  state = {
    opened: false,
  }

  _dialogNode = null
  _documentClickListener = this._onDocumentClick.bind(this)

  componentWillMount() {
    let node = document.getElementById('dialog');
    if(!node) {
      node = document.createElement('div');
      node.id = 'dialog';
      document.getElementById('app').appendChild(node);
    }
    this._dialogNode = node;
    document.addEventListener('click', this._documentClickListener);
  }

  componentWillUnmount() {
    if(this.state.opened) {
      this._close();
    }
    React.unmountComponentAtNode(this._dialogNode);
    this._dialogNode.className = '';

    this._dialogNode = null;
    document.removeEventListener('click', this._documentClickListener);
  }

  componentWillReceiveProps(nextProps) {
    if(typeof nextProps.opened !== 'undefined') {
      this.setState({opened: nextProps.opened});
    }
  }

  componentDidUpdate() {
    this._dialogNode.className = classNames({'opened': this.state.opened});

    React.render(
      <div className="content">
        {this.props.children}
      </div>,
      this._dialogNode
    );
  }

  render() {
    return null;
  }

  _open() {
    this.setState({opened: true});
  }

  _close() {
    this.setState({opened: false});
  }

  _onDocumentClick(event) {
    if(!this.state.opened) {
      return;
    }
    if(event.target !== document.getElementById('dialog')) {
      return;
    }
    event.stopPropagation();
    this._close();
  }
}
