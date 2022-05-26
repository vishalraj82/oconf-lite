import { deepExtend } from "../lib/deep-extend.js";
import expect from "unexpected";

describe("deep-extend", () => {
  it("should extend an object with another object", () => {
    expect(deepExtend({ a: 1 }, { b: 2 }), "to equal", { a: 1, b: 2 });
  });

  it("should always create a new object", () => {
    const src = { a: 1 };

    expect(deepExtend(src), "not to be", src); // "to be" checks for referential equality like Object.is or ===
    expect(deepExtend(src, { b: 2 }), "not to equal", src);
    expect(src, "to equal", { a: 1 });
  });

  it("should always create a new object, also in leafs", () => {
    const a = { b: 1 };
    const b = { d: { e: 1 } };
    const c = { d: { f: 2 } };

    expect(deepExtend(a, b, c), "to equal", {
      b: 1,
      d: { e: 1, f: 2 },
    });
    expect(a, "to equal", { b: 1 });
    expect(b, "to equal", { d: { e: 1 } });
    expect(c, "to equal", { d: { f: 2 } });
  });

  it("should always copy even nested objects", () => {
    const a = { b: { c: 1 } };
    const b = { d: 1 };
    const config = deepExtend(a, b);

    expect(config, "to equal", { b: { c: 1 }, d: 1 });

    config.b.e = 1;

    expect(a, "to equal", { b: { c: 1 } });
  });
});
