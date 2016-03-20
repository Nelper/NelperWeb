jest.autoMockOff();

const reporters = require('jasmine-reporters');
const path = require('path');

if (process.env.NODE_ENV === 'test') {
  const junitReporter = new reporters.JUnitXmlReporter({
    savePath: path.resolve(__dirname, '../test_ouput/'),
    consolidateAll: false,
  });

  jasmine.getEnv().addReporter(junitReporter);
}

jest.autoMockOn();
