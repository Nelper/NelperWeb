import React from 'react';

const ReactIntl = jest.genMockFromModule('react-intl');

export class FormattedNumber extends React.Component {
  render() {
    return <span>{this.props.value}</span>;
  }
}

export default ReactIntl;
