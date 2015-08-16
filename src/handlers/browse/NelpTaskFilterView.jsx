import React, {Component, PropTypes} from 'react';

export default class NelpTaskFilterView extends Component {

  static propTypes = {
    onFilterChanged: PropTypes.func.isRequired,
  }

  _onShowOptions() {

  }

  _onOptionClick() {
  }

  render() {
    const filtersData = [
      {
        id: 'sort',
        name: 'Sort tasks by:',
        options: [{
          name: 'Distance',
          value: 'distance',
        }],
      }, {
        id: 'region',
        name: 'Region:',
        options: [{
          name: 'Canada',
          value: 'canada',
        }, {
          name: 'United States',
          value: 'usa',
        }],
      }, {
        id: 'category',
        name: 'Category:',
        options: [{
          name: 'All',
          value: 'all',
        }, {
          name: 'Technology',
          value: 'tech',
        }],
      },
    ];

    const filters = filtersData.map(f => {
      return (
        <div key={f.id} className="filter" onClick={this._onShowOptions.bind(this, f)}>
          <div className="title">{f.name}</div>
          <div className="value">{f.options[0].name}</div>
        </div>
      );
    });

    return (
      <div className="nelp-task-filter-view">
        {filters}
      </div>
    );
  }
}
