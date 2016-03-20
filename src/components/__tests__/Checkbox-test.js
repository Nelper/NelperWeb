jest.dontMock('../Checkbox');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const Checkbox = require('../Checkbox').default;

describe('Checkbox', () => {
  it('onCheck called on click', () => {
    const checked = false;
    const onCheck = jest.genMockFunction();
    const checkbox = TestUtils.renderIntoDocument(
      <Checkbox selected={checked} onCheck={onCheck} />
    );

    const checkboxNode = ReactDOM.findDOMNode(checkbox);
    expect(checkboxNode).toBeDefined();

    TestUtils.Simulate.click(checkboxNode);
    expect(onCheck).toBeCalledWith(!checked);
  });

  it('has the checked class when selected', () => {
    const checkbox = TestUtils.renderIntoDocument(
      <Checkbox selected />
    );

    const checkboxNode = ReactDOM.findDOMNode(checkbox);
    expect(checkboxNode.classList.contains('checked')).toBe(true);
  });

  it('doesnt have the checked class when not selected', () => {
    const checkbox = TestUtils.renderIntoDocument(
      <Checkbox />
    );

    const checkboxNode = ReactDOM.findDOMNode(checkbox);
    expect(checkboxNode.classList.contains('checked')).toBe(false);
  });

  it('shows the title prop', () => {
    const title = 'hello';
    const checkbox = TestUtils.renderIntoDocument(
      <Checkbox title={title} />
    );

    const checkboxNode = ReactDOM.findDOMNode(checkbox);
    expect(checkboxNode.textContent).toBe(title);
  });
});
