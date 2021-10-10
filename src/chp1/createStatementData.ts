enum PlayType {
  tragedy = "tragedy",
  comedy = "comedy",
}

interface Play {
  name: string;
  type: keyof typeof PlayType;
}

export interface Plays {
  [index: string]: Play;
}

interface Performance {
  playID: string;
  audience: number;
}

export interface Invoice {
  customer: string;
  performances: Performance[];
}

interface PerformanceEx extends Performance {
  play: Play;
  amount: number;
  volummeCredits: number;
}

export interface StatementData {
  customer: string;
  performances: PerformanceEx[];
  totalAmout: number;
  totalVoulmeCredits: number;
}

function createStatementData(invoice: Invoice, plays: Plays) {
  const statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmout = totalAmout(statementData);
  statementData.totalVoulmeCredits = totalVoulmeCredits(statementData);
  return statementData;

  function enrichPerformance(aPerformance: Performance): PerformanceEx {
    // const result: PerformanceEx = Object.assign({}, aPerformance);
    // result.play = playFor(result);
    const result: any = {
      ...aPerformance,
    };
    result.play = playFor(result);
    result.amount = amoutFor(result);
    result.volummeCredits = volummeCreditsFor(result);
    return result;
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function amoutFor(aPerformance: PerformanceEx) {
    let result = 0;
    switch (aPerformance!.play.type) {
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
        throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
    }
    return result;
  }

  function volummeCreditsFor(aPerformance: PerformanceEx) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if (PlayType.comedy === aPerformance.play.type) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }

  function totalAmout(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVoulmeCredits(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.volummeCredits, 0);
  }
}

export default createStatementData;
