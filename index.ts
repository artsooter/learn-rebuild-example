import plays from "./data/plays.json";
import allInvoice from "./data/order.json";
import createStatement from "./createStatement";
import type {
  Play,
  Plays,
  Orders,
  Invoices,
  Invoice,
  Order,
  Statement,
  EnrichOrder,
  EnrichOrders,
} from "./entity/rebuildLearnType";

function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function statement(invoice: Invoice, plays: Plays) {
  return renderPlainText(createStatement(invoice, plays), plays);
}

function renderPlainText(statement: Statement, plays: Plays) {
  let result = statement.customer + "的账单";
  for (let aOrder of statement.orders) {
    result +=
      aOrder.play.name +
      ":" +
      usd(aOrder.amount) +
      "(" +
      aOrder.audienceNumber +
      ")" +
      "\n";
  }
  result += "总共消费：" + usd(statement.totalAmount) + "\n";
  result += "获得积分：" + statement.totalVolumeCredit;
  return result;
}

const curInvoices = allInvoice[0];
sampleTest(statement(curInvoices, plays));
console.log(statement(curInvoices, plays));

function sampleTest(newResponse: string) {
  const oldResponse =
    "张三的账单a:$650.00(55)\n" +
    "b:$580.00(35)\n" +
    "c:$500.00(40)\n" +
    "总共消费：$1,730.00\n" +
    "获得积分：47";

  if (oldResponse == newResponse) {
    console.log(" --- 测试通过 --- \n");
  } else {
    throw new Error("测试不通过");
  }
}
