# oconf-lite

Modern and lean version of [oconf](https://github.com/one-com/node-oconf).

This module lets you use JSON or similar fileformats to store configuration, and
inherit other configurations through the use of includes. The following two
files `common.cjson` and `production.cjson` are an example of how includes allow
you to manage configuration between different environments. You can imagine how
we have a third file `development.cjson` for development specific overrides.

```json
// common.cjson
{
  "server": {
    "port": 80,
  },
  "auth": {
    "loginUrl": "/development-login.html",
    "cookieOptions": {
      "httpOnly": true
    }
  },
  "publicDir": "http-pub"
}

// production.cjson
{
  "#include": "common.cjson",
  "auth": {
    "loginUrl": "https://login.example.com/"
  },
  "publicDir": "http-pub-production"
}
```

Using the following snippet we will load the `production.cjson` file and resolve
the included configuration.

```js
const config = oconf.load("production.cjson");
console.log(config);
```

... yielding the following output:

```json
{
  "server": {
    "port": 80,
  },
  "auth": {
    "loginUrl": "https://login.example.com/",
    "cookieOptions": {
      "httpOnly": true
    }
  },
  "publicDir": "http-pub-production"
}
```


## Differences from the original

First and foremost, this is a slimmed down version of oconf. We are not removing
features because they aren't desired, but because they aren't known to be used
very much if at all. Maybe we have been too eager to remove features; please let
us know if we removed something that you cannot live without.

`oconf-lite` has zero dependencies and weigh in at less than 20 KB with both esm
and cjs versions of the code in the package. `oconf` and dependencies was almost
7 MB.

1. There's no cli-script built-in.
2. `#include`-directives only work at the top-level.
3. `#include`-directives only support a single string, not array of strings.
4. `#public`-directives not supported at all.
5. No longer ships support for
   [relaxedjson](https://www.npmjs.com/package/relaxed-json) parser.

### Custom CJSON Parser

Original `oconf` used a module for parsing cjson files. To get to
zero-dependencies in `oconf-lite` we hand-rolled a brutally simplistic
replacement for the `cjson` module.

Instead of actually implementing a parser, it will simply do a single pass
through the input string, replacing any comments with whitespace. This means
that we can just rely on `JSON.parse` to do the heavy lifting. Our benchmarks
shows that using the `cjson` parser implementation takes about 3.5 times longer.
This is well within micro optimization territory; normally you will load your
configuration once per process invocation, and the `cjson` module ran 10,000
iterations of the benchmark in just above 350 ms on my laptop.

Replacing the comments with whitespace instead of just removing them means that
parse errors from `JSON.parse` are meaningful as is. They give the position
offset into the JSON string, which we can then translate into line numbers and
positions.
