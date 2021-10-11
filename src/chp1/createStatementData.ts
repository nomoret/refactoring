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

class PerformanceCalculator {
  protected performance: Performance;
  play: Play;

  constructor(aPerformance: Performance, play: Play) {
    this.performance = aPerformance;
    this.play = play;
  }

  get amount(): number | void {
    throw new Error(`서브클래스에서 처리하도록 설계되었습니다`);
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class ComedyCaculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

class TragedyCaculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

function createPerformanceCalculator(aPerformance: Performance, play: Play) {
  switch (play.type) {
    case PlayType.comedy:
      return new ComedyCaculator(aPerformance, play);
    case PlayType.tragedy:
      return new TragedyCaculator(aPerformance, play);
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }
}

function createStatementData(invoice: Invoice, plays: Plays) {
  const statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmout = totalAmout(statementData);
  statementData.totalVoulmeCredits = totalVoulmeCredits(statementData);
  return statementData;

  function enrichPerformance(aPerformance: Performance): PerformanceEx {
    const caculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );

    // const result: PerformanceEx = Object.assign({}, aPerformance);
    // result.play = playFor(result);
    const result: any = {
      ...aPerformance,
    };
    result.play = caculator.play;
    result.amount = caculator.amount;
    result.volummeCredits = caculator.volumeCredits;
    return result;
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function totalAmout(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVoulmeCredits(data: StatementData) {
    return data.performances.reduce((total, p) => total + p.volummeCredits, 0);
  }
}

export default createStatementData;
