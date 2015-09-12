import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class Breadcrumbs extends Component {

  static contextTypes = {
    history: PropTypes.object.isRequired,
  }

  static propTypes = {
    branch: PropTypes.array.isRequired,
  }

  _onRouteClick(branch, index) {
    this.context.history.go(-index);
  }

  render() {
    const routes = this.props.branch.filter(b => {
      return b.name;
    });

    // Only display the breadcumbs if theres 2+ levels of route.
    if (routes.length < 2) {
      return null;
    }

    const displayedRoutes = routes.map((b, i) => {
      const isLast = i === routes.length - 1;
      return (
        <div
          key={i}
          className={classNames('breadcrumbs-route', {'active-route': isLast})}
          onClick={() => this._onRouteClick(b, routes.length - i - 1)}
        >
          {b.name}
          {
            !isLast ?
            <div className="breadcrumbs-separator" /> :
            null
          }
        </div>
      );
    });

    return (
      <div className="breadcrumbs-component">
        {displayedRoutes}
      </div>
    );
  }
}
