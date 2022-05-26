import { Oconf } from "../../lib/oconf-lite.js";
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const oconf = new Oconf({
  parser: { parse: yaml.load },
});

const config = oconf.load(path.resolve(__dirname, "production.yaml"));

console.log(config);
