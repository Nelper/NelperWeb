import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import {FormattedNumber} from 'react-intl';

import styles from './PriceTag.scss';

@cssModules(styles)
export default class PriceTag extends Component {
  static propTypes = {
    price: PropTypes.number,
    scale: PropTypes.number,
    inverse: PropTypes.bool,
  }

  static defaultProps = {
    scale: 1,
    inverse: false,
  }

  render() {
    return (
      <div styleName={this.props.inverse ? 'price-tag-inverse' : 'price-tag'} style={{transform: `scale(${this.props.scale})`}}>
        <FormattedNumber value={this.props.price} format="priceTag" />
      </div>
    );
  }
}
