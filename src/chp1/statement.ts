enum PlayType {
  tragedy = "tragedy",
  comedy = "comedy",
}

interface Play {
  name: string;
  type: keyof typeof PlayType;
}

interface Plays {
  [index: string]: Play;
}

interface Invoice {
  customer: string;
  performances: {
    playID: string;
    audience: number;
  }[];
}

function statement(invoice: Invoice, plays: Plays): string {
  let totalAmout = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];

    let thisAmount = 0;
    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    volumeCredits += Math.max(perf.audience - 30, 0);
    if (PlayType.comedy === play.type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    result += `  ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmout += thisAmount;
  }
  result += `Amount owed is ${format(totalAmout / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function htmlStatement(invoice: Invoice, plays: Plays): any {
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
