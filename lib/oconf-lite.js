import cjsonParser from "./cjson-parser.js";
import Oconf from "./Oconf.js";
export { default as Oconf } from "./Oconf.js";

const oconf = new Oconf({
  parser: {
    parse: cjsonParser,
  },
});

export default oconf;

// A little hack to make the following work in cjs:
// const { Oconf } = require('oconf');
if (typeof __dirname !== "undefined") {
  oconf.Oconf = Oconf;
}
