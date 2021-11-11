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
  customer?: string;
  performances: PerformanceEx[];
  totalAmount: number;
  totalVoulmeCredits: number;
}

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

class PerformanceCalculator {
  performance: Performance;
  play: Play;
  constructor(aPerformance: Performance, play: Play) {
    this.performance = aPerformance;
    this.play = play;
  }

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${this.play.type}`);
    }
    return result;
  }
}

export function createStatementData(invoice: Invoice, plays: Plays) {
  const statementData: StatementData = {
    performances: [],
    totalAmount: 0,
    totalVoulmeCredits: 0,
  };
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmout(statementData);
  statementData.totalVoulmeCredits = totalVoulmeCredits(statementData);
  return statementData;

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function enrichPerformance(aPerformance: Performance) {
    const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result: any = Object.assign({}, aPerformance); // 얉은 복사
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volummeCredits = volummeCreditsFor(result);
    return result;
  }
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
  return data.performances!.reduce((total, p) => total + p.amount, 0);
}

function totalVoulmeCredits(data: StatementData) {
  return data.performances!.reduce((total, p) => total + p.volummeCredits, 0);
}
