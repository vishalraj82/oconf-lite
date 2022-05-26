import { Oconf } from "../../lib/oconf-lite.js";
import hjson from "hjson";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const oconf = new Oconf({
  parser: hjson,
});

const config = oconf.load(path.resolve(__dirname, "production.hjson"));

console.log(config);
