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

  static defaultProps = {
    onFiltersChanged: () => {},
  }

  state = {
    allCategories: true,
    selectedCategories: [],
    otherFiltersOpened: false,
    maxDistanceActive: false,
    maxDistance: 5,
    minPriceActive: false,
    minPrice: 20,
  }

  _documentClickListener = this._onDocumentClick.bind(this)

  componentDidMount() {
    document.addEventListener('click', this._documentClickListener);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._documentClickListener);
  }

  _onSelectCategory(category) {
    const curSelectedCategories = this.state.selectedCategories;
    curSelectedCategories[category] = !curSelectedCategories[category];

    this.setState({
      allCategories: false,
      selectedCategories: curSelectedCategories,
    });

    this._filtersChanged(
      false,
      curSelectedCategories,
      this.state.maxDistanceActive,
      this.state.maxDistance,
      this.state.minPriceActive,
      this.state.minPrice,
    );
  }

  _onSelectAllCategories() {
    this.setState({
      allCategories: true,
      selectedCategories: [],
    });

    this._filtersChanged(
      true,
      null,
      this.state.maxDistanceActive,
      this.state.maxDistance,
      this.state.minPriceActive,
      this.state.minPrice,
    );
  }

  _onDocumentClick(event) {
    function isInside(node, target) {
      let cur = target;
      while (cur) {
        if (cur === node) {
          return true;
        }
        cur = cur.parentNode;
      }
      return false;
    }

    if (!this.state.otherFiltersOpened || event.defaultPrevented) {
      return;
    }
    if (isInside(this.refs.filterDropdown.getDOMNode(), event.target)) {
      return;
    }
    event.stopPropagation();
    this.setState({otherFiltersOpened: false});
  }

  _onToggleOtherFilters(event) {
    event.preventDefault();
    this.setState({otherFiltersOpened: !this.state.otherFiltersOpened});
  }

  _onMaxDistanceCheck() {
    this.setState({maxDistanceActive: !this.state.maxDistanceActive});

    this._filtersChanged(
      this.state.allCategories,
      this.state.selectedCategories,
      !this.state.maxDistanceActive,
      this.state.maxDistance,
      this.state.minPriceActive,
      this.state.minPrice,
    );
  }

  _onMaxDistanceChange(maxDistance) {
    this.setState({
      maxDistance,
      maxDistanceActive: true,
    });

    this._filtersChanged(
      this.state.allCategories,
      this.state.selectedCategories,
      true,
      maxDistance,
      this.state.minPriceActive,
      this.state.minPrice,
    );
  }

  _onMinPriceCheck() {
    this.setState({minPriceActive: !this.state.minPriceActive});

    this._filtersChanged(
      this.state.allCategories,
      this.state.selectedCategories,
      this.state.maxDistanceActive,
      this.state.maxDistance,
      !this.state.minPriceActive,
      this.state.minPrice,
    );
  }

  _onMinPriceChange(minPrice) {
    this.setState({
      minPrice,
      minPriceActive: true,
    });

    this._filtersChanged(
      this.state.allCategories,
      this.state.selectedCategories,
      this.state.maxDistanceActive,
      this.state.maxDistance,
      true,
      minPrice,
    );
  }

  _filtersChanged(allCategories, categories, maxDistanceActive, maxDistance, minPriceActive, minPrice) {
    const selectedCategories = !allCategories ?
      Object.keys(categories)
        .filter(c => categories[c]) :
      null;

    this.props.onFiltersChanged({
      categories: selectedCategories,
      maxDistance: maxDistanceActive ? maxDistance : null,
      minPrice: minPriceActive ? minPrice : null,
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
          <div ref="filterDropdown" className={classNames('other-filters-dropdown', {'opened': otherFiltersOpened})}>
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
                  step={1}
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
