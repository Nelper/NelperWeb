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
    gray: PropTypes.bool,
  };

  static defaultProps = {
    scale: 1,
    inverse: false,
  };

  render() {
    let style;
    if (this.props.inverse) {
      style = 'price-tag-inverse';
    } else if (this.props.gray) {
      style = 'price-tag-gray';
    } else {
      style = 'price-tag';
    }
    return (
      <div styleName={style} style={{transform: `scale(${this.props.scale})`}}>
        <FormattedNumber value={this.props.price} format="priceTag" />
      </div>
    );
  }
}
