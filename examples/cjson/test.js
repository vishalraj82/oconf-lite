import oconf from "../../lib/oconf-lite.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = oconf.load(path.resolve(__dirname, "production.cjson"));

console.log(config);
