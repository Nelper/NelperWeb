const ParseActual = require.requireActual('../parse');

const ParseMock = jest.genMockFromModule('../parse');

let _mockData = {};

function getType(type) {
  if (typeof type === 'string') {
    return type;
  }
  return type.className;
}

ParseMock.Query = class {
  constructor(type) {
    this._type = getType(type);
  }

  include() {
    return this;
  }

  get(id) {
    const typeData = _mockData[this._type];
    return Promise.resolve(typeData && typeData.find(data => data.id === id));
  }
};

ParseMock.__setMockData = (type, data) => {
  _mockData[getType(type)] = data;
};

ParseMock.__clearMockData = () => {
  _mockData = {};
};

ParseMock.Object = ParseActual.Object;
ParseMock.User = ParseActual.User;

export default ParseMock;
