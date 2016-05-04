jest.autoMockOff();

import utils from 'react-addons-test-utils';
import React, { View } from 'react-native';

jest.dontMock('../NavigationBar');

const NavigationBar = require('../NavigationBar.js').default;

describe('NavigationBar', () => {

  let navigationBar;

  function render(props) {
    const renderer = utils.createRenderer();
    renderer.render(<NavigationBar {...props} />);
    const output = renderer.getRenderOutput();

    return {
      props,
      output,
      renderer,
    };
  }

  it('should render header', () => {
    navigationBar = render({
      title: 'Test header title',
    });

    const { output } = navigationBar;

    expect(output.type).toEqual(View);
  });

});
