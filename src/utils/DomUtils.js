export function isInside(node, target) {
  let cur = target;
  while (cur) {
    if (cur === node) {
      return true;
    }
    cur = cur.parentNode;
  }
  return false;
}
