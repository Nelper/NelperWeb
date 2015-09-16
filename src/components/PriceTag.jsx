import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import {FormattedNumber} from 'react-intl';

import styles from './PriceTag.scss';

@cssModules(styles)
export default class PriceTag extends Component {
  static propTypes = {
    price: PropTypes.number,
    scale: PropTypes.number,
  }

  static defaultProps = {
    scale: 1,
  }

  render() {
    return (
      <div styleName="price-tag" style={{transform: `scale(${this.props.scale})`}}>
        <FormattedNumber value={this.props.price} format="priceTag" />
      </div>
    );
  }
}
