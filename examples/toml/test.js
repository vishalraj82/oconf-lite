import { Oconf } from "../../lib/oconf-lite.js";
import toml from "toml";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const oconf = new Oconf({
  parser: toml,
});

const config = oconf.load(path.resolve(__dirname, "production.toml"));

console.log(config);
