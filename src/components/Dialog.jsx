import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

export default class Dialog extends Component {

  static propTypes = {
    opened: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.node,
  }

  state = {
    opened: false,
    opening: false,
    closing: false,
  }

  _openingTimeout = null
  _closingTimeout = null
  _dialogNode = null
  _documentClickListener = this._onDocumentClick.bind(this)

  componentDidMount() {
    let node = document.getElementById('dialog');
    if (!node) {
      node = document.createElement('div');
      node.id = 'dialog';
      document.body.appendChild(node);
    }
    this._dialogNode = node;
    document.addEventListener('click', this._documentClickListener);


    if (this.props.opened) {
      this._open();
    } else {
      this._renderPortal();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.opened !== 'undefined') {
      if (nextProps.opened && !this.state.opened) {
        this._open();
      } else if (!nextProps.opened && this.state.opened) {
        this._close();
      }
    }
  }

  componentDidUpdate() {
    this._renderPortal();
  }

  componentWillUnmount() {
    if (this.state.opened) {
      this._close();
      React.unmountComponentAtNode(this._dialogNode);
      this._dialogNode.className = '';
    }
    clearTimeout(this._openingTimeout);
    clearTimeout(this._closingTimeout);
    this._dialogNode = null;
    document.removeEventListener('click', this._documentClickListener);
  }

  _onDocumentClick(event) {
    if (!this.state.opened || this.state.opening) {
      return;
    }
    if (event.target !== document.getElementById('dialog')) {
      return;
    }
    event.stopPropagation();
    this._close();
  }

  _open() {
    this.setState({
      opened: true,
      opening: true,
      closing: false,
    });

    this._openingTimeout = setTimeout(() => {
      this.setState({opening: false});
    }, 251);

    // Make sure the body doesn't scroll when the popup is opened.
    document.body.style.overflow = 'hidden';
  }

  _close() {
    if (this.state.closing) {
      return;
    }
    this.setState({
      opened: false,
      opening: false,
      closing: true,
    });

    // Restore scroll.
    document.body.style.overflow = '';
    this._closingTimeout = setTimeout(() => {
      this.setState({closing: false});
    }, 251);

    if (this.props.onClose) {
      this.props.onClose.call(null);
    }
  }

  _renderPortal() {
    this._dialogNode.className = classNames(
      {'opened': this.state.opened},
      {'closing': this.state.closing},
    );

    ReactDOM.render(
      <div className="content">
        {this.props.children}
      </div>,
      this._dialogNode
    );
  }

  render() {
    return null;
  }
}
