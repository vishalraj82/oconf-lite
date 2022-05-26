import Oconf from "../lib/Oconf.js";
import expect from "unexpected";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("Oconf", () => {
  it("should throw when instantiated without a parser", () => {
    expect(() => new Oconf(), "to throw", /parser/);
  });

  it("should read a simple configuration file", () => {
    const oconf = new Oconf({
      parser: { parse: () => ({ mock: 1 }) },
    });
    const filePath = path.resolve(__dirname, "../package.json");

    expect(oconf.load(filePath), "to equal", { mock: 1 });
  });

  describe("#loadFileAndResolveIncludes", () => {
    it("should throw when called with a relative url", () => {
      const oconf = new Oconf({
        parser: { parse: () => ({ mock: 1 }) },
      });

      expect(
        () => oconf.loadFileAndResolveIncludes("test.cjson"),
        "to throw",
        "filePath should be absolute"
      );
    });

    it("should detect circular dependencies between configuration files", () => {
      const oconf = new Oconf({ parser: JSON });

      oconf.readFile = (filePath) => {
        switch (filePath) {
          case "/app/config/a.cjson":
            return '{"#include": "b.cjson", "a": 1}';
          case "/app/config/b.cjson":
            return '{"#include": "a.cjson", "b": 1}';
          default:
            throw new Error("WAT");
        }
      };

      expect(
        () => oconf.loadFileAndResolveIncludes("/app/config/a.cjson"),
        "to throw",
        "Circular dependency detected:\n" +
          "   loading /app/config/a.cjson\n" +
          " including /app/config/b.cjson\n" +
          " including /app/config/a.cjson"
      );
    });

    it("should annotate the filepath on error messages on unsupported features", () => {
      const oconf = new Oconf({ parser: JSON });
      oconf.readFile = (filePath) => {
        switch (filePath) {
          case "/app/config/a.cjson":
            return '{"#include": ["b.cjson", "c.cjson"], "a": 1}';
          default:
            throw new Error("WAT");
        }
      };

      expect(
        () => oconf.loadFileAndResolveIncludes("/app/config/a.cjson"),
        "to throw",
        'oconf-lite only supports including single files: "[#include]"\n' +
          "  while parsing: /app/config/a.cjson"
      );
    });

    it("should extend the included file", () => {
      const oconf = new Oconf({ parser: JSON });

      oconf.readFile = (filePath) => {
        switch (filePath) {
          case "/app/config/a.cjson":
            return '{"#include": "b.cjson", "a": 1}';
          case "/app/config/b.cjson":
            return '{"b": 1}';
          default:
            throw new Error("WAT");
        }
      };

      expect(
        oconf.loadFileAndResolveIncludes("/app/config/a.cjson"),
        "to equal",
        {
          a: 1,
          b: 1,
        }
      );
    });

    it("should deep-extend the included file", () => {
      const oconf = new Oconf({ parser: JSON });

      oconf.readFile = (filePath) => {
        switch (filePath) {
          case "/app/config/a.cjson":
            return '{"#include": "b.cjson", "a": { "c": 1 }}';
          case "/app/config/b.cjson":
            return '{"a": {"a": 2, "b": 2, "c": 2}, "b": 2}';
          default:
            throw new Error("WAT");
        }
      };

      expect(
        oconf.loadFileAndResolveIncludes("/app/config/a.cjson"),
        "to equal",
        {
          a: {
            a: 2,
            b: 2,
            c: 1,
          },
          b: 2,
        }
      );
    });
  });
});
