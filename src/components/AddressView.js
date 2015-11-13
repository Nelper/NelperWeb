import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';

import styles from './AddressView.scss';

@cssModules(styles)
export default class AddressView extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    short: PropTypes.bool,
  };

  static defaultProps = {
    short: false,
  };

  render() {
    const {location, short} = this.props;
    return (
      <div styleName="address-view">
        <div>
          {location.streetNumber} {location.route}
        </div>
        <div>
          {location.city}, {location.province}
        </div>
        {
          !short ?
          <div>{location.postalCode}</div> :
          null
        }
      </div>
    );
  }
}
