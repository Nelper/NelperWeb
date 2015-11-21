import React, {Component} from 'react';

import Progress from 'components/Progress';

export default class LoadingView extends Component {

  render() {
    return (
      <div className="progress-center">
        <Progress />
      </div>
    );
  }
}
