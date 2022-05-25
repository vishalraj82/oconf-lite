import expect from "unexpected";
import cjsonParser, { stripComments } from "../lib/cjson-parser.js";
import { deindent } from "@gustavnikolaj/string-utils";

describe("cjson-parser", () => {
  it("should parse regular json", () => {
    expect(cjsonParser('{"a": 1}'), "to equal", { a: 1 });
  });

  it("should parse regular json with a url", () => {
    expect(cjsonParser('{"a": "http://www.example.com"}'), "to equal", {
      a: "http://www.example.com",
    });
  });

  it("should parse regular json with a comment in a string", () => {
    expect(
      cjsonParser('{"a": "/* this is a comment in a string */"}'),
      "to equal",
      {
        a: "/* this is a comment in a string */",
      }
    );
  });

  it("should parse json with a multiline comment", () => {
    const cjson = deindent`
      {
        /*
        This is a multiline comment
        */
       "a": 1
      }
    `;

    expect(cjsonParser(cjson), "to equal", { a: 1 });
  });

  it("should parse json with a comment", () => {
    const cjson = deindent`
      {
       // This is a comment
       "a": 1
      }
    `;

    expect(cjsonParser(cjson), "to equal", { a: 1 });
  });

  it("should parse json with a comment 2", () => {
    const cjson = deindent`
      {
       "a": 1 // This is a comment
      }
    `;

    expect(cjsonParser(cjson), "to equal", { a: 1 });
  });

  it("should throw on invalid json", () => {
    const cjson = deindent`
      {
       "a": 1 // This is a comment
       "b": 2
      }
    `;

    expect(
      () => cjsonParser(cjson),
      "to throw",
      "Unexpected string in JSON at line 3 character 2"
    );
  });

  it("should throw on invalid json with multiline json", () => {
    const cjson = deindent`
      {
       "a": 1 /* This is a comment


      */ "b": 2
      }
    `;

    expect(
      () => cjsonParser(cjson),
      "to throw",
      "Unexpected string in JSON at line 5 character 4"
    );
  });

  it("should throw on unterminated multiline comment", () => {
    const cjson = deindent`
      {
        "a": 1 /* This is a comment
        "b": 2
      }
    `;

    expect(
      () => cjsonParser(cjson),
      "to throw",
      "Unterminated multiline comment at line 2 character 10"
    );
  });

  describe("stripComments", () => {
    it("should strip a multiline comment replacing the comment with whitespace", () => {
      const raw = deindent`
        {
          /*
          This is a multiline comment
          */
          "a": 1
        }
      `;
      const output = stripComments(raw);

      expect(
        output,
        "to satisfy",
        expect
          .it(
            "to equal",
            '{\n    \n                             \n    \n  "a": 1\n}'
          )
          .and("to have length", raw.length)
      );
    });

    it("should strip a comment replacing the comment with whitespace", () => {
      const raw = deindent`
      {
        // This is a single line comment
        "a": 1
      }
    `;
      const output = stripComments(raw);

      expect(
        output,
        "to satisfy",
        expect
          .it("to equal", '{\n                                  \n  "a": 1\n}')
          .and("to have length", raw.length)
      );
    });

    it("should strip a comment at the end of the file", () => {
      const raw = ["{", '  "a": 1', "}", "// a comment at the end"].join("\n");
      const output = stripComments(raw);

      expect(
        output,
        "to satisfy",
        expect
          .it("to equal", '{\n  "a": 1\n}\n                       ')
          .and("to have length", raw.length)
      );
    });

    it("should throw on unterminated multiline comment", () => {
      const cjson = deindent`
        {
          "a": 1 /* This is a comment
          "b": 2
        }
      `;

      expect(
        () => stripComments(cjson),
        "to throw",
        "Unterminated multiline comment at position 11"
      );
    });
  });
});
