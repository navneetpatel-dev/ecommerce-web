/**
 * AST detector for client-side money arithmetic.
 *
 * The frontend displays money, it never calculates it: every amount arrives
 * from the API already computed by the backend pricing engine. This walks the
 * TypeScript syntax tree (not text) so operand order, line wrapping, property
 * access and compound assignment cannot hide a calculation.
 */
import ts from "typescript";

/** Words that make an identifier a money value. */
const MONEY_WORDS = new Set([
  "price",
  "prices",
  "amount",
  "amounts",
  "total",
  "totals",
  "subtotal",
  "subtotals",
  "revenue",
  "discount",
  "discounts",
  "refund",
  "refunds",
  "payout",
  "payouts",
  "commission",
  "earning",
  "earnings",
  "balance",
  "cashback",
  "gmv",
  "fee",
  "fees",
  "charge",
  "charges",
  "tax",
  "taxes",
  "gst",
  "cgst",
  "sgst",
  "igst",
  "tds",
  "tcs",
  "shipping",
  "cost",
  "costs",
  "mrp",
  "saving",
  "savings",
  "paid",
  "due",
  "payable",
  "cod",
  "cash",
  "wallet",
  "points",
  "paise",
  "rupees",
  "inr",
]);

/**
 * A money word followed by one of these is not a money value
 * (`totalPages`, `amountLabel`, `priceText`, `discountPercent`).
 */
const NON_MONEY_TAILS = new Set([
  "page",
  "pages",
  "count",
  "counts",
  "items",
  "item",
  "rows",
  "label",
  "labels",
  "text",
  "id",
  "ids",
  "key",
  "keys",
  "index",
  "loading",
  "visible",
  "open",
  "error",
  "errors",
  "status",
  "type",
  "mode",
  "format",
  "formatted",
  "style",
  "styles",
  "class",
  "name",
  "percent",
  "rate",
  "ratio",
  "pct",
  "url",
  "icon",
]);

const ARITHMETIC = new Set([
  ts.SyntaxKind.PlusToken,
  ts.SyntaxKind.MinusToken,
  ts.SyntaxKind.AsteriskToken,
  ts.SyntaxKind.SlashToken,
  ts.SyntaxKind.PercentToken,
  ts.SyntaxKind.AsteriskAsteriskToken,
  ts.SyntaxKind.PlusEqualsToken,
  ts.SyntaxKind.MinusEqualsToken,
  ts.SyntaxKind.AsteriskEqualsToken,
  ts.SyntaxKind.SlashEqualsToken,
  ts.SyntaxKind.PercentEqualsToken,
]);

const NUMERIC_COERCIONS = new Set(["Number", "parseFloat", "parseInt"]);

/** `grandTotalAmount` → ["grand", "total", "amount"]; `GIFT_MIN_AMOUNT` → ["gift", "min", "amount"]. */
function splitWords(name) {
  return name
    .replace(/^[_$]+/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_$]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

export function isMoneyName(name) {
  const words = splitWords(name);
  const moneyIndex = words.findIndex((word) => MONEY_WORDS.has(word));
  if (moneyIndex === -1) return false;
  return !NON_MONEY_TAILS.has(words[words.length - 1]);
}

/** The identifier an operand is "about", looking through casts, `?? 0`, and `Number(...)`. */
function operandName(node) {
  if (!node) return null;
  if (ts.isParenthesizedExpression(node)) return operandName(node.expression);
  if (ts.isAsExpression(node) || ts.isNonNullExpression(node)) {
    return operandName(node.expression);
  }
  if (ts.isSatisfiesExpression?.(node)) return operandName(node.expression);
  if (ts.isPrefixUnaryExpression(node)) return operandName(node.operand);
  if (ts.isIdentifier(node)) return node.text;
  if (ts.isPropertyAccessExpression(node)) return node.name.text;
  if (
    ts.isElementAccessExpression(node) &&
    ts.isStringLiteralLike(node.argumentExpression)
  ) {
    return node.argumentExpression.text;
  }
  if (
    ts.isBinaryExpression(node) &&
    (node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken ||
      node.operatorToken.kind === ts.SyntaxKind.BarBarToken)
  ) {
    return operandName(node.left);
  }
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    NUMERIC_COERCIONS.has(node.expression.text)
  ) {
    return operandName(node.arguments[0]);
  }
  return null;
}

function isStringOperand(node) {
  return (
    ts.isStringLiteralLike(node) ||
    ts.isTemplateExpression(node) ||
    (ts.isParenthesizedExpression(node) && isStringOperand(node.expression))
  );
}

/** `Math` functions that compute a new amount (clamp, round, absolute value). */
const MATH_MONEY_FUNCTIONS = new Set([
  "min",
  "max",
  "abs",
  "round",
  "floor",
  "ceil",
  "trunc",
]);

/** Words that make a bare `total` mean money (`grandTotal`) rather than a row count. */
const TOTAL_MONEY_QUALIFIERS = new Set([
  "grand",
  "order",
  "cart",
  "line",
  "customer",
  "vendor",
  "payable",
  "net",
  "gross",
  "invoice",
  "bill",
]);

/**
 * `isMoneyName` for a `Math.*` argument. There, a lone `total` is almost always a
 * row count (`Math.min(page * limit, total)` — the "showing 1–20 of N" clamp), so a
 * name whose only money word is total(s) needs a qualifier such as grand or order.
 */
function isMathMoneyName(name) {
  if (!isMoneyName(name)) return false;
  const words = splitWords(name);
  const moneyWords = words.filter((word) => MONEY_WORDS.has(word));
  if (moneyWords.some((word) => word !== "total" && word !== "totals")) {
    return true;
  }
  return words.some((word) => TOTAL_MONEY_QUALIFIERS.has(word));
}

/** `Math.min(walletBalance, amountDue)`: the client choosing or rounding an amount. */
function mathCallMoneyName(node) {
  if (
    !ts.isCallExpression(node) ||
    !ts.isPropertyAccessExpression(node.expression) ||
    !ts.isIdentifier(node.expression.expression) ||
    node.expression.expression.text !== "Math" ||
    !MATH_MONEY_FUNCTIONS.has(node.expression.name.text)
  ) {
    return null;
  }
  return (
    node.arguments
      .map((arg) => operandName(arg))
      .find((candidate) => candidate && isMathMoneyName(candidate)) ?? null
  );
}

/**
 * Returns every arithmetic expression — an operator, or a `Math.min/max/abs/round/…`
 * call — in `sourceText` that has a money-named operand.
 * @returns {Array<{ line: number, text: string, name: string }>}
 */
export function findMoneyArithmetic(sourceText, fileName = "file.tsx") {
  const kind = fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    kind,
  );
  const findings = [];

  function visit(node) {
    const mathName = mathCallMoneyName(node);
    if (mathName) {
      const { line } = source.getLineAndCharacterOfPosition(
        node.getStart(source),
      );
      findings.push({
        line: line + 1,
        text: node.getText(source).replace(/\s+/g, " "),
        name: mathName,
      });
      return;
    }
    if (
      ts.isBinaryExpression(node) &&
      ARITHMETIC.has(node.operatorToken.kind)
    ) {
      const isPlus =
        node.operatorToken.kind === ts.SyntaxKind.PlusToken ||
        node.operatorToken.kind === ts.SyntaxKind.PlusEqualsToken;
      const concatenation =
        isPlus && (isStringOperand(node.left) || isStringOperand(node.right));
      if (!concatenation) {
        const name = [operandName(node.left), operandName(node.right)].find(
          (candidate) => candidate && isMoneyName(candidate),
        );
        if (name) {
          const { line } = source.getLineAndCharacterOfPosition(
            node.getStart(source),
          );
          findings.push({
            line: line + 1,
            text: node.getText(source).replace(/\s+/g, " "),
            name,
          });
          return;
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return findings;
}

const COERCION_CALLS = new Set(["Number", "parseFloat", "String"]);

/** A `₹` followed by a value nobody formatted: a bare identifier, property, or coercion. */
function isUnformattedValue(node) {
  if (ts.isParenthesizedExpression(node))
    return isUnformattedValue(node.expression);
  if (ts.isCallExpression(node)) {
    return (
      ts.isIdentifier(node.expression) &&
      COERCION_CALLS.has(node.expression.text)
    );
  }
  const isValue =
    ts.isIdentifier(node) ||
    ts.isPropertyAccessExpression(node) ||
    ts.isElementAccessExpression(node) ||
    ts.isNonNullExpression(node);
  // `grandTotalFormatted`, `priceLabel`: already run through a formatter upstream.
  return isValue && !/formatted|label|text/i.test(operandName(node) ?? "");
}

function endsWithRupee(text) {
  return /₹\s*$/.test(text);
}

/**
 * Returns every place money is displayed without the shared formatters in
 * shared/utils/formatting: `.toFixed()` on a money value (no grouping, and
 * `toFixed(0)` silently rounds), or a `₹` placed directly before a raw value
 * in a template literal or JSX.
 * @returns {Array<{ line: number, text: string }>}
 */
export function findRawMoneyDisplay(sourceText, fileName = "file.tsx") {
  const kind = fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    kind,
  );
  const findings = [];
  const report = (node) => {
    const { line } = source.getLineAndCharacterOfPosition(
      node.getStart(source),
    );
    findings.push({
      line: line + 1,
      text: node.getText(source).replace(/\s+/g, " "),
    });
  };

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "toFixed"
    ) {
      const name = operandName(node.expression.expression);
      if (name && isMoneyName(name)) report(node);
    }

    if (ts.isTemplateExpression(node)) {
      let before = node.head.text;
      for (const span of node.templateSpans) {
        if (endsWithRupee(before) && isUnformattedValue(span.expression)) {
          report(span.expression);
        }
        before = span.literal.text;
      }
    }

    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      const children = node.children;
      for (let i = 1; i < children.length; i += 1) {
        const prev = children[i - 1];
        const child = children[i];
        if (
          ts.isJsxText(prev) &&
          endsWithRupee(prev.text) &&
          ts.isJsxExpression(child) &&
          child.expression &&
          isUnformattedValue(child.expression)
        ) {
          report(child.expression);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
  return findings;
}

/** The shared money and points formatters (and thin wrappers that forward to them). */
const MONEY_FORMATTER = /^format(Inr|Points|AnalyticsInr)/;

function isNumberCoercion(node) {
  return (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === "Number"
  );
}

function isZeroLiteral(node) {
  return ts.isNumericLiteral(node) && Number(node.text) === 0;
}

/**
 * A money formatter fed `x ?? 0`, `x || 0` or `Number(x)`. The formatters accept
 * decimal strings and render a missing amount as "—"; a zero fallback (and
 * `Number(null)`, which is 0) turns "the server sent nothing" into a confident
 * ₹0, which reads as real money.
 */
export function findZeroFallbackFormat(sourceText, fileName = "file.tsx") {
  const kind = fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    kind,
  );
  const findings = [];

  function containsZeroFallback(node) {
    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken ||
        node.operatorToken.kind === ts.SyntaxKind.BarBarToken) &&
      isZeroLiteral(node.right)
    ) {
      return true;
    }
    return ts.forEachChild(node, containsZeroFallback) === true;
  }

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      MONEY_FORMATTER.test(node.expression.text) &&
      node.arguments.some(
        (arg) => containsZeroFallback(arg) || isNumberCoercion(arg),
      )
    ) {
      const { line } = source.getLineAndCharacterOfPosition(
        node.getStart(source),
      );
      findings.push({
        line: line + 1,
        text: node.getText(source).replace(/\s+/g, " "),
      });
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return findings;
}
