import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import Icon from './Icon';

export default class Rating extends Component {

  static propTypes = {
    rating: PropTypes.number,
    dark: PropTypes.bool,
    small: PropTypes.bool,
  }

  static defaultProps = {
    dark: false,
    small: false,
  }

  render() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push(
        <Icon
          svg={require('images/icons/star.svg')}
          className={classNames('rating-item', {'active': i < this.props.rating})}
          key={i} />
      );
    }

    return (
      <div className={classNames(
        'rating',
        {'dark': this.props.dark},
        {'small': this.props.small},
      )}>
        {items}
      </div>
    );
  }
}
