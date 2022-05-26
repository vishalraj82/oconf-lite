function renderObjPath(objPath) {
  return objPath
    .map((str) => {
      if (/^[a-z_$]\w+/.test(str)) {
        return str;
      }
      return `[${str}]`;
    })
    .reduce((str, next) => {
      if (/^\[/.test(next)) {
        return str + next;
      }
      return `${str}.${next}`;
    }, "");
}

export function checkForUnsupportedFeatures(obj, objPath = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (/#public$/.test(key)) {
      const keyPath = renderObjPath([...objPath, key]);
      throw new Error(`oconf-lite does not support #public keys: "${keyPath}"`);
    }

    if (key === "#include" && objPath.length > 0) {
      const keyPath = renderObjPath([...objPath, key]);
      throw new Error(
        `oconf-lite only supports #include at the root level: "${keyPath}"`
      );
    }

    if (typeof value === "object" && value) {
      checkForUnsupportedFeatures(value, [...objPath, key]);
    }

    if (key === "#include") {
      if (typeof value !== "string") {
        const keyPath = renderObjPath([...objPath, key]);
        throw new Error(
          `oconf-lite only supports including single files: "${keyPath}"`
        );
      }
    }
  }
}
