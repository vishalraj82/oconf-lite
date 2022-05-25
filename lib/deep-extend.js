function objectHasOwn(obj, key) {
  // Object.hasOwn was not introduced in node.js until version 16.9.0.
  // We can remove this "fallback" function when we drop support for node.js v14.
  if (typeof Object.hasOwn === "function") {
    return Object.hasOwn(obj, key);
  }

  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function deepExtend(...objects) {
  const target = {};

  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      if (objectHasOwn(obj, key)) {
        const val = obj[key];

        if (typeof val === "object") {
          if (typeof target[key] === "object" && target[key]) {
            target[key] = deepExtend(target[key], val);
          } else {
            target[key] = deepExtend(val);
          }
        } else {
          target[key] = val;
        }
      }
    }
  }

  return target;
}
