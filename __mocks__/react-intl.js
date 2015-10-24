import React from 'react';

const ReactIntl = jest.genMockFromModule('react-intl');

ReactIntl.FormattedNumber = class extends React.Component {
  render() {
    return <span>{this.props.value}</span>;
  }
};

export default ReactIntl;
