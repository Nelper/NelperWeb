import React, {Component} from 'react';
import connectToStores from 'alt/utils/connectToStores';

import TaskStore from 'stores/TaskStore';

@connectToStores
export default class ViewProfileHandler extends Component {

  static getStores() {
    return [TaskStore];
  }

  static getPropsFromStores() {
    return TaskStore.getState();
  }

  state = {
    style: {
      top: 0,
      left: -99999,
      width: '100%',
      height: '100%',
      opacity: 0,
    },
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.user === this.props.user) {
      return;
    }
    let opened = !!nextProps.user;
    requestAnimationFrame(() => {
      let style = this.state.style;
      style.left = opened ? 0 : -99999;
      style.opacity = opened ? 1 : 0;
      this.setState({style});
    });
  }

  render() {
    return (
      <div style={Object.assign({
        position: 'absolute',
        backgroundColor: 'blue',
        transition: 'opacity 500ms linear',
      }, this.state.style)}>
        <div style={{marginTop: 80, fontSize: 20}} onClick={::this._close}>X</div>
      </div>
    );
  }

  _close() {
    if(this.props.onClose) {
      this.props.onClose.call(null);
    }
  }
}
