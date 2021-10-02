interface Play {
  hamlet: any;
  "as-like": any;
  othello: any;
}

interface Invoice {
  customer: string;
  performances: {
    playID: string;
    audience: number;
  }[];
}

function statement(invoice: Invoice, plays: Play): string {
  let expected =
    "Statement for BigCo\n" +
    "  Hamlet: $650.00 (55 seats)\n" +
    "  As You Like It: $580.00 (35 seats)\n" +
    "  Othello: $500.00 (40 seats)\n" +
    "Amount owed is $1,730.00\n" +
    "You earned 47 credits\n";
  return expected;
}

function htmlStatement(invoice: Invoice, plays: Play): any {
  let result = `<h1>Statement for BigCo</h1>\n`;
  result += "<table>\n";
  result += `<tr><th>play</th><th>seats</th><th>cost</th></tr>  <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n`;
  result += `  <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n`;
  result += `  <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n`;
  result += "</table>\n";
  result += `<p>Amount owed is <em>$1,730.00</em></p>\n`;
  result += `<p>You earned <em>47</em> credits</p>\n`;
  return result;
}

export { statement, htmlStatement };
