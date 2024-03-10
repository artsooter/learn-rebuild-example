import {
  EnrichOrder,
  EnrichOrders,
  Invoice,
  Order,
  Play,
  Plays,
  Statement,
} from "./entity/rebuildLearnType";

function createStatement(invoice: Invoice, plays: Plays) {
  const statement = {} as Statement;
  statement.customer = invoice.customer;
  statement.orders = invoice.orders.map((order) => enrichOrders(order));
  statement.totalAmount = totalAmount(statement.orders);
  statement.totalVolumeCredit = totalVolumeCredit(statement.orders);
  return statement;

  function totalAmount(orders: EnrichOrders) {
    let result = 0; // 金额
    for (let aOrder of orders) {
      result += aOrder.amount;
    }
    return result;
  }
  function totalVolumeCredit(orders: EnrichOrders) {
    let result = 0; // 积分
    for (let aOrder of orders) {
      result += aOrder.volumeCredit;
    }
    return result;
  }
  function enrichOrders(aOrder: Order): EnrichOrder {
    const orderCalc = createOrderCalc(aOrder, plays[aOrder.playID]);
    let result = Object.assign({}, aOrder) as any as EnrichOrder;
    result.play = orderCalc.play;
    result.amount = orderCalc.amount;
    result.volumeCredit = orderCalc.volumeCredit;
    return result;
  }
}

abstract class OrderCalc {
  public aOrder: Order;
  public play: Play;

  protected constructor(aOrder: Order, play: Play) {
    this.aOrder = aOrder;
    this.play = play;
  }
  abstract get amount(): number;
  abstract get volumeCredit(): number;
}

function createOrderCalc(aOrder: Order, play: Play) {
  switch (play.type) {
    case "tragedy": {
      return new TragedyOrderCalc(aOrder, play);
    }
    case "comedy": {
      return new ComedyOrderCalc(aOrder, play);
    }
    default:
      throw new Error("'asd");
  }
}

class TragedyOrderCalc extends OrderCalc {
  constructor(aOrder: Order, play: Play) {
    super(aOrder, play);
  }
  get amount() {
    let result = 40000;
    if (this.aOrder.audienceNumber > 30) {
      result += 1000 * (this.aOrder.audienceNumber - 30);
    }
    return result;
  }

  get volumeCredit() {
    let result = 0;
    result += Math.max(this.aOrder.audienceNumber - 30, 0);
    return result;
  }
}

class ComedyOrderCalc extends OrderCalc {
  constructor(aOrder: Order, play: Play) {
    super(aOrder, play);
  }
  get amount() {
    let result = 30000;
    if (this.aOrder.audienceNumber > 20) {
      result += 10000 + 500 * (this.aOrder.audienceNumber - 20);
    }
    result += 300 * this.aOrder.audienceNumber;
    return result;
  }
  get volumeCredit() {
    let result = 0;
    result += Math.max(this.aOrder.audienceNumber - 30, 0);
    result += Math.floor(this.aOrder.audienceNumber / 5);
    return result;
  }
}

export default createStatement;
