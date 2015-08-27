import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

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

  render() {
    const {selectedCategories} = this.state;

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
            className={classNames('category-icon', 'category-all', {'is-selected': this.state.allCategories})}
            onClick={::this._onSelectAllCategories}
          />
          {categoryFilters}
        </div>
      </div>
    );
  }
}
