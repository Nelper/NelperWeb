import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import NumericInput from 'components/NumericInput';
import Checkbox from 'components/Checkbox';
import Icon from 'components/Icon';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';

export default class BrowseTasksFilterView extends Component {

  static propTypes = {
    onFiltersChanged: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      allCategories: true,
      selectedCategories: [],
      otherFiltersOpened: false,
      maxDistanceActive: false,
      maxDistance: 5,
      minPriceActive: false,
      minPrice: 20,
    };
  }

  _onSelectCategory(category) {
    const curSelectedCategories = this.state.selectedCategories;
    curSelectedCategories[category] = !curSelectedCategories[category];

    const selectedCategories = Object.keys(curSelectedCategories)
      .filter(c => this.state.selectedCategories[c]);

    this.props.onFiltersChanged && this.props.onFiltersChanged({
      categories: selectedCategories,
    });

    this.setState({
      allCategories: false,
      selectedCategories: curSelectedCategories,
    });
  }

  _onSelectAllCategories() {
    this.props.onFiltersChanged && this.props.onFiltersChanged({
      categories: null,
    });

    this.setState({
      allCategories: true,
      selectedCategories: [],
    });
  }

  _onToggleOtherFilters() {
    this.setState({otherFiltersOpened: !this.state.otherFiltersOpened});
  }

  _onMaxDistanceCheck() {
    this.setState({maxDistanceActive: !this.state.maxDistanceActive});
  }

  _onMaxDistanceChange(maxDistance) {
    this.setState({
      maxDistance,
      maxDistanceActive: true,
    });
  }

  _onMinPriceCheck() {
    this.setState({minPriceActive: !this.state.minPriceActive});
  }

  _onMinPriceChange(minPrice) {
    this.setState({
      minPrice,
      minPriceActive: true,
    });
  }

  render() {
    const {
      selectedCategories,
      allCategories,
      otherFiltersOpened,
      minPriceActive,
      maxDistanceActive,
    } = this.state;

    const categoryFilters = TaskCategoryUtils.list().map(c => {
      const isSelected = selectedCategories[c];
      return (
        <div
          key={c}
          className={classNames('category-icon', {'is-selected': isSelected})}
          style={{
            backgroundImage: `url('${TaskCategoryUtils.getImage(c)}')`,
          }}
          onClick={() => this._onSelectCategory(c)}
        />
      );
    });

    return (
      <div className="browse-tasks-filter-view">
        <div className="category-filters">
          <div key="all"
            className={classNames('category-icon', 'category-all', {'is-selected': allCategories})}
            onClick={::this._onSelectAllCategories}
          />
          {categoryFilters}
        </div>
        <div className="other-filters">
          <div className={classNames('other-filters-dropdown', {'opened': otherFiltersOpened})}>
            <div className="filter-distance">
              <div className="filter-title">
                <Checkbox
                  title="Distance range"
                  selected={maxDistanceActive}
                  onCheck={::this._onMaxDistanceCheck}
                />
              </div>
              <div className="filter-subtitle">Within</div>
              <div className="filter-input">
                <NumericInput
                  disabled={!maxDistanceActive}
                  value={this.state.maxDistance}
                  onChange={::this._onMaxDistanceChange}
                />
              </div>
            </div>
            <div className="filter-price">
              <div className="filter-title">
                <Checkbox
                  title="Price range"
                  selected={minPriceActive}
                  onCheck={::this._onMinPriceCheck}
                />
              </div>
              <div className="filter-subtitle">Higher than</div>
              <div className="filter-input">
                <NumericInput
                  disabled={!minPriceActive}
                  value={this.state.minPrice}
                  onChange={::this._onMinPriceChange}
                />
              </div>
            </div>
          </div>
          <button
            className={classNames(
              'border-btn',
              'other-filters-btn',
              {'disabled': !maxDistanceActive && !minPriceActive},
            )}
            onClick={::this._onToggleOtherFilters}
          >
            <span>More filters</span>
            <Icon className={classNames('expand-icon', {'expanded': otherFiltersOpened})} svg={require('images/icons/expand.svg')} />
          </button>
        </div>
      </div>
    );
  }
}
