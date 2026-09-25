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

/**
 * Returns every arithmetic expression in `sourceText` that has a money-named operand.
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
