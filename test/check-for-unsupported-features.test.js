import expect from "unexpected";
import { checkForUnsupportedFeatures } from "../lib/check-for-unsupported-features.js";

describe("checkForUnsupportedFeatures", () => {
  it("should warn against the use of #public keys", () => {
    expect(
      () => checkForUnsupportedFeatures({ foo: { "bar#public": "foobar" } }),
      "to throw",
      `oconf-lite does not support #public keys: ".foo.bar#public"`
    );
  });

  it("should allow include keys at the root level", () => {
    expect(
      () => checkForUnsupportedFeatures({ "#include": "foobar.cjson" }),
      "not to throw"
    );
  });

  it("should warn against nested include keys", () => {
    expect(
      () => checkForUnsupportedFeatures({ foo: { "#include": "bar.cjson" } }),
      "to throw",
      `oconf-lite only supports #include at the root level: ".foo[#include]"`
    );
  });

  it("should warn against array include keys", () => {
    expect(
      () => checkForUnsupportedFeatures({ "#include": ["bar.cjson"] }),
      "to throw",
      `oconf-lite only supports including single files: "[#include]"`
    );
  });
});
