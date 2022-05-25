export function stripComments(raw) {
  let inString = false;

  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '"' && i - 1 >= 0 && raw[i - 1] !== "\\") {
      inString = !inString;
    } else if (!inString && raw[i] === "/" && raw[i + 1] === "*") {
      let indexOfEndOfComment = raw.indexOf("*/", i + 2);

      if (indexOfEndOfComment === -1) {
        throw new Error(`Unterminated multiline comment at position ${i}`);
      } else {
        raw =
          raw.substring(0, i) +
          raw.substring(i, indexOfEndOfComment + 2).replace(/[^\n]/g, " ") +
          raw.substring(indexOfEndOfComment + 2);
      }
    } else if (!inString && raw[i] === "/" && raw[i + 1] === "/") {
      let indexOfNextEndOfLine = raw.indexOf("\n", i + 2);

      if (indexOfNextEndOfLine === -1) {
        raw = raw.substring(0, i) + raw.substring(i).replace(/[^\n]/g, " ");
      } else {
        const lengthOfComment = indexOfNextEndOfLine - i;
        raw =
          raw.substring(0, i) +
          " ".repeat(lengthOfComment) +
          raw.substring(indexOfNextEndOfLine);
      }
    }
  }

  return raw;
}

const unexpectedTokenAtRegex = /^Unexpected (\w+) in JSON at position (\d+)$/;
const untermAtRegex = /^Unterminated multiline comment at position (\d+)$/;

function addLineNumberToError(err, string) {
  const unexpectedTokenMatches = err.message.match(unexpectedTokenAtRegex);

  if (unexpectedTokenMatches) {
    const [, token, position] = unexpectedTokenMatches;
    const partial = string.substring(0, position);
    const lineNumber = partial.split("\n").length;
    const char = partial.substring(partial.lastIndexOf("\n")).length;

    err.message = `Unexpected ${token} in JSON at line ${lineNumber} character ${char}`;

    return err;
  }

  const untermMatches = err.message.match(untermAtRegex);

  if (untermMatches) {
    const [, position] = untermMatches;
    const partial = string.substring(0, position);
    const lineNumber = partial.split("\n").length;
    const char = partial.substring(partial.lastIndexOf("\n")).length;

    err.message = `Unterminated multiline comment at line ${lineNumber} character ${char}`;

    return err;
  }

  return err;
}

export default function cjsonParser(raw) {
  try {
    const strippedString = stripComments(raw);
    return JSON.parse(strippedString);
  } catch (e) {
    e = addLineNumberToError(e, raw);

    throw e;
  }
}
