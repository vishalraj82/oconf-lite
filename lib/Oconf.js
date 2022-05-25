import fs from "fs";
import path from "path";
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

    const include = config["#include"];

    if (include) {
      if (typeof include !== "string") {
        throw new Error(
          `mini-oconf only supports including single files - while loading ${filePath}`
        );
      }

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
