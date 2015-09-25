import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const DIALOG_ANIMATION_DURATION = 251;

export default class Dialog extends Component {

  static propTypes = {
    opened: PropTypes.bool,
    fill: PropTypes.bool,
    fillAll: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.node,
    dialogClassName: PropTypes.string,
  }

  static defaultProps = {
    fill: false,
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
    const node = document.createElement('div');
    node.className = 'dialog';
    document.body.appendChild(node);

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
    const unMount = () => {
      ReactDOM.unmountComponentAtNode(this._dialogNode);

      clearTimeout(this._openingTimeout);
      clearTimeout(this._closingTimeout);
      document.body.removeChild(this._dialogNode);
      document.removeEventListener('click', this._documentClickListener);
    };

    if (this.state.opened) {
      this._close();
      this._dialogNode.className = 'dialog';
      setTimeout(unMount, DIALOG_ANIMATION_DURATION);
    } else {
      unMount();
    }
  }

  _onDocumentClick(event) {
    if (!this.state.opened || this.state.opening) {
      return;
    }
    if (event.target !== this._dialogNode) {
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
    }, DIALOG_ANIMATION_DURATION);

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
    }, DIALOG_ANIMATION_DURATION);

    if (this.props.onClose) {
      this.props.onClose.call(null);
    }
  }

  _renderPortal() {
    this._dialogNode.className = classNames(
      'dialog',
      {'opened': this.state.opened},
      {'closing': this.state.closing},
    );

    if (!this.state.opened) {
      return;
    }

    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      <div className={classNames(
          'content',
          this.props.dialogClassName,
          {'fill': this.props.fill},
          {'fill-all': this.props.fillAll},
        )}>
        {this.props.children}
      </div>,
      this._dialogNode
    );
  }

  render() {
    return null;
  }
}
