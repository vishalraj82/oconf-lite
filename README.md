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
