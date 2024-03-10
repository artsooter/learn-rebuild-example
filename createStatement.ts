import {
  EnrichOrder,
  EnrichOrders,
  Invoice,
  Order,
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
  function amountFor(aOrder: EnrichOrder) {
    let result = 0;
    switch (aOrder.play?.type) {
      case "tragedy": {
        result = 40000;
        if (aOrder.audienceNumber > 30) {
          result += 1000 * (aOrder.audienceNumber - 30);
        }
        break;
      }
      case "comedy": {
        result = 30000;
        if (aOrder.audienceNumber > 20) {
          result += 10000 + 500 * (aOrder.audienceNumber - 20);
        }
        result += 300 * aOrder.audienceNumber;
        break;
      }
      default:
        throw new Error("未知类型：" + aOrder.play.type);
    }
    return result;
  }
  function volumeCreditsFor(aOrder: EnrichOrder) {
    let result = 0;
    // 计算积分
    result += Math.max(aOrder.audienceNumber - 30, 0);
    // 计算额外的积分
    if (aOrder.play.type === "comedy") {
      result += Math.floor(aOrder.audienceNumber / 5);
    }
    return result;
  }
  function enrichOrders(aOrder: Order): EnrichOrder {
    let result = Object.assign(
      { play: plays[aOrder.playID], amount: 0, volumeCredit: 0 },
      aOrder
    );
    result.amount = amountFor(result);
    result.volumeCredit = volumeCreditsFor(result);
    return result;
  }
}

export default createStatement;
