// benchmark cjson

import cjson from "cjson";
import cjsonParser from "../lib/cjson-parser.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ITERATIONS = 10000;

const raw = await fs.readFile(
  path.resolve(__dirname, "../package.json"),
  "utf-8"
);

async function runCjsonBenchmark() {
  console.log("running `cjson.parse` for " + ITERATIONS + " iterations");

  const startTime = Date.now();

  for (let i = 0; i < ITERATIONS; i++) {
    const result = cjson.parse(raw); // eslint-disable-line no-unused-vars
  }

  console.log("finished in " + (Date.now() - startTime) + "ms");
}

async function runCjsonParserBenchmark() {
  console.log("running `cjsonParser` for " + ITERATIONS + " iterations");

  const startTime = Date.now();

  for (let i = 0; i < ITERATIONS; i++) {
    const result = cjsonParser(raw); // eslint-disable-line no-unused-vars
  }

  console.log("finished in " + (Date.now() - startTime) + "ms");
}

await runCjsonBenchmark();

await runCjsonParserBenchmark();
