import expect from "unexpected";
import oconfLite, { Oconf } from "../lib/oconf-lite.js";

describe("oconf-lite", () => {
  it("should be an instance of Oconf", () => {
    expect(oconfLite, "to be an", Oconf);
  });

  it("should have a .load method", () => {
    expect(oconfLite.load, "to be a function");
  });
});
