# NelperWeb

[![Circle CI](https://circleci.com/gh/Nelper/NelperWeb.svg?style=svg&circle-token=9ff50bb39dbe56fbd0f72c99452f319c3a8c83c3)](https://circleci.com/gh/Nelper/NelperWeb)

## Developement

### Installation

```
npm install
```

### Run the local dev server

```
npm run watch
```

The site will be available at http://localhost:8080/.

## Production

Commits in this repo are pushed to the production server if the build suceeds and it passes the tests.

### Production build

Using this command will build the site in the /build directory.

```
npm run build
```

### Production server

Runs a server that serves the builded files.

```
npm run start-server
```

## Contributing

For the JS style guidelines refer to https://github.com/Nelper/javascript.
For SASS refer to http://sass-guidelin.es

Make sure the code lints with both eslint and scss-lint.
