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

interface Performance {
  playID: string;
  audience: number;
}

interface Invoice {
  customer: string;
  performances: Performance[];
}

function statement(invoice: Invoice, plays: Plays): string {
  const statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  return renderPlainText(statementData, plays);

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function enrichPerformance(aPerformance: Performance) {
    const result: any = Object.assign({}, aPerformance); // 얉은 복사
    result.play = playFor(result);
    return result;
  }

  function renderPlainText(data: any, plays: Plays) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
      result += `  ${playFor(perf).name}: ${usd(amoutFor(perf))} (${
        perf.audience
      } seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmout())}\n`;
    result += `You earned ${totalVoulmeCredits()} credits\n`;
    return result;

    function totalAmout() {
      let result = 0;
      for (let perf of data.performances) {
        result += amoutFor(perf);
      }
      return result;
    }

    function totalVoulmeCredits() {
      let result = 0;
      for (let perf of data.performances) {
        result += volummeCreditsFor(perf);
      }
      return result;
    }

    function volummeCreditsFor(aPerformance: {
      playID: string;
      audience: number;
    }) {
      let result = 0;
      result += Math.max(aPerformance.audience - 30, 0);
      if (PlayType.comedy === playFor(aPerformance).type) {
        result += Math.floor(aPerformance.audience / 5);
      }
      return result;
    }

    function usd(aNumber: number) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(aNumber / 100);
    }

    function amoutFor(aPerformance: Performance) {
      let result = 0;
      switch (playFor(aPerformance).type) {
        case "tragedy":
          result = 40000;
          if (aPerformance.audience) {
            result += 1000 * (aPerformance.audience - 30);
          }
          break;
        case "comedy":
          result = 30000;
          if (aPerformance.audience > 20) {
            result += 10000 + 500 * (aPerformance.audience - 20);
          }
          result += 300 * aPerformance.audience;
          break;
        default:
          throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
      }
      return result;
    }
  }
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
