import cjsonParser from "./cjson-parser.js";
import Oconf from "./Oconf.js";

export default new Oconf({
  parser: {
    parse: cjsonParser,
  },
});

export { Oconf };
