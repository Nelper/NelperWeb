import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class Breadcrumbs extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    branch: PropTypes.array.isRequired,
  };

  _onRouteClick(branch, index) {
    this.context.router.go(-index);
  };

  render() {
    const curRoute = this.props.branch[this.props.branch.length - 1];

    // Only display the breadcumbs if theres 2+ levels of route.
    if (!curRoute || !curRoute.breadcrumbs) {
      return null;
    }

    const displayedRoutes = curRoute.breadcrumbs.map((b, i) => {
      const isLast = i === curRoute.breadcrumbs.length - 1;
      return (
        <div
          key={i}
          className={classNames('breadcrumbs-route', {'active-route': isLast})}
          onClick={() => this._onRouteClick(b, curRoute.breadcrumbs.length - i - 1)}
        >
          {b}
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
