import React, {Component} from 'react';
import classNames from 'classnames';

import Icon from './Icon';

export default class Rating extends Component {

  static propTypes = {
    rating: React.PropTypes.number,
  }

  static defaultProps = {
    dark: false,
    small: false,
  }

  render() {
    let items = [];
    for(let i = 0; i < 5; i++) {
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
