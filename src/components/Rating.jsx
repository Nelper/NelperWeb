import React, {Component, PropTypes} from 'react';
import cssModules from 'react-css-modules';
import classNames from 'classnames';

import Icon from './Icon';

import styles from './Rating.scss';

@cssModules(styles, {allowMultiple: true})
export default class Rating extends Component {

  static propTypes = {
    rating: PropTypes.number.isRequired,
    dark: PropTypes.bool,
    small: PropTypes.bool,
    number: PropTypes.number,
  }

  static defaultProps = {
    dark: false,
    small: false,
    number: -1,
  }

  render() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push(
        <Icon
          svg={require('images/icons/star.svg')}
          styleName={classNames('rating-item', {'active': i < this.props.rating})}
          key={i} />
      );
    }

    return (
      <div styleName={classNames(
        'rating',
        {'dark': this.props.dark},
        {'small': this.props.small},
      )}>
        {items}
        {
          this.props.number >= 0 ?
          <div styleName="number">({this.props.number})</div> :
          null
        }
      </div>
    );
  }
}
