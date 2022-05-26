import Oconf from "../lib/Oconf.js";
import expect from "unexpected";

describe("Oconf", () => {
  it("should throw when instantiated without a parser", () => {
    expect(() => new Oconf(), "to throw", /parser/);
  });
});
