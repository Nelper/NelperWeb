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
    editable: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    dark: false,
    small: false,
    number: -1,
    editable: false,
    onChange: () => {},
  };

  state = {
    hoveredRating: 0,
  };

  _onRatingChange(rating) {
    if (!this.props.editable) {
      return;
    }

    this.props.onChange(rating + 1);
  }

  _onItemEnter(index) {
    if (!this.props.editable) {
      return;
    }
    this.setState({hoveredRating: index + 1});
  }

  _onItemLeave() {
    if (!this.props.editable) {
      return;
    }
    this.setState({hoveredRating: 0});
  }

  render() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push(
        <Icon
          svg={require('images/icons/star.svg')}
          styleName={classNames(
            'rating-item',
            {'active': i < this.props.rating},
            {'hovered': i < this.state.hoveredRating && i >= this.props.rating}
          )}
          key={i}
          onClick={() => this._onRatingChange(i)}
          onMouseEnter={() => this._onItemEnter(i)}
          onMouseLeave={::this._onItemLeave}
        />
      );
    }

    return (
      <div styleName={classNames(
        'rating',
        {'dark': this.props.dark},
        {'small': this.props.small},
        {'editable': this.props.editable},
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
