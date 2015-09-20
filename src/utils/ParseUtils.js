export function fixParseFileURL(url) {
  return url.replace(/http:\/\//, 'https://s3.amazonaws.com/');
}

export function userFromParse(parseUser) {
  const user = parseUser.toPlainObject();

  if (parseUser.get('customPicture')) {
    // If the user has uploaded a picture we use it.
    user.pictureURL = fixParseFileURL(parseUser.get('customPicture').url());
  } else if (!user.pictureURL) {
    // If the user has no picture at all use the placeholder.
    user.pictureURL = require('images/user-no-picture.jpg');
  }

  return user;
}

export function meFromParse(parseUser) {
  const user = userFromParse(parseUser);
  user.privateData = parseUser.get('privateData').toPlainObject();
  user.logged = true;
  return user;
}
