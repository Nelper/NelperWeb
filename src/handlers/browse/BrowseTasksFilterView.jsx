import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import Dialog from 'components/Dialog';
import TaskCategoryUtils from 'utils/TaskCategoryUtils';

export default class BrowseTasksFilterView extends Component {

  static propTypes = {
    onFiltersChanged: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const selectedCategories = TaskCategoryUtils.list().reduce((prev, cur) => {
      prev[cur] = true;
      return prev;
    }, {});

    this.state = {
      selectedCategories,
      sortBy: 'date',
      isDirty: false,
      filtersDialogOpened: false,
    };
  }

  _onOpenFiltersDialog() {
    this.setState({
      filtersDialogOpened: true,
      isDirty: false,
    });
  }

  _onDialogClose() {
    if (this.state.isDirty) {
      const selectedCategories = Object.keys(this.state.selectedCategories)
        .filter(c => this.state.selectedCategories[c]);
      this.props.onFiltersChanged && this.props.onFiltersChanged({
        categories: selectedCategories,
        sort: this.state.sortBy,
      });
    }

    this.setState({
      filtersDialogOpened: false,
      isDirty: false,
    });
  }

  _onSelectCategory(category) {
    const selectedCategories = this.state.selectedCategories;
    selectedCategories[category] = !selectedCategories[category];
    this.setState({
      selectedCategories,
      isDirty: true,
    });
  }

  _onSelectSort(sort) {
    this.setState({
      sortBy: sort,
      isDirty: true,
    });
  }

  render() {
    const {filtersDialogOpened, selectedCategories} = this.state;

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
        <Dialog
          opened={filtersDialogOpened}
          onClose={::this._onDialogClose}
        >
          <div className="browse-tasks-filter-view-dialog">
            <h2>Category filter</h2>
            <div className="category-filters">
              {categoryFilters}
            </div>
            <h2>Sort by</h2>
            <div className="sort-filters">
              <button onClick={() => this._onSelectSort('date')}>Creation Date</button>
              <button onClick={() => this._onSelectSort('distance')}>Distance</button>
              <button onClick={() => this._onSelectSort('price')}>Price</button>
            </div>
          </div>
        </Dialog>
        <button onClick={::this._onOpenFiltersDialog}>View filters</button>
      </div>
    );
  }
}
