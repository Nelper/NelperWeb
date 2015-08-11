// Generate unique IDs for use as pseudo-private/protected names.
// Similar in concept to
// <http://wiki.ecmascript.org/doku.php?id=strawman:names>.
export default function createId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
