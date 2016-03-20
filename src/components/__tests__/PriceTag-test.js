jest.dontMock('../PriceTag');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const PriceTag = require('../PriceTag').default;

describe('PriceTag', () => {
  it('displays the price', () => {
    const priceValue = 100;
    const priceTag = TestUtils.renderIntoDocument(
      <PriceTag price={priceValue} />
    );

    const priceTagNode = ReactDOM.findDOMNode(priceTag);
    expect(priceTagNode).toBeDefined();
    expect(priceTagNode.textContent).toContain(priceValue);
  });
});
