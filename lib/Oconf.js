import fs from "fs";
import path from "path";
import { checkForUnsupportedFeatures } from "./check-for-unsupported-features.js";
import { deepExtend } from "./deep-extend.js";

export default class Oconf {
  constructor(options = {}) {
    this.parser = options.parser;

    if (!this.parser) {
      throw new Error(
        "You must pass in an oconf compatible parser in options.parser"
      );
    }
  }

  readFile(filePath) {
    return fs.readFileSync(filePath, "utf8");
  }

  loadFileAndResolveIncludes(filePath, filestack = []) {
    if (!path.isAbsolute(filePath)) {
      throw new Error("filePath should be absolute");
    }

    if (filestack.indexOf(filePath) !== -1) {
      throw new Error(
        `Circular dependency detected:\n   loading ${filestack.join(
          "\n including "
        )}\n including ${filePath}`
      );
    }

    filestack.push(filePath);

    const fileContents = this.readFile(filePath);
    let config = this.parser.parse(fileContents);

    try {
      checkForUnsupportedFeatures(config);
    } catch (e) {
      e.message = `${e.message}\n  while parsing: ${filePath}`;
      throw e;
    }

    const include = config["#include"];

    if (include) {
      delete config["#include"];

      config = deepExtend(
        this.loadFileAndResolveIncludes(
          path.resolve(path.dirname(filePath), include),
          filestack
        ),
        config
      );
    }

    return config;
  }

  load(filePath) {
    return this.loadFileAndResolveIncludes(filePath);
  }
}
