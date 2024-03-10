"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plays_json_1 = __importDefault(require("./data/plays.json"));
const order_json_1 = __importDefault(require("./data/order.json"));
const createStatement_1 = __importDefault(require("./createStatement"));
function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(aNumber / 100);
}
function statement(invoice, plays) {
    return renderPlainText((0, createStatement_1.default)(invoice, plays), plays);
}
function renderPlainText(statement, plays) {
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
const curInvoices = order_json_1.default[0];
sampleTest(statement(curInvoices, plays_json_1.default));
console.log(statement(curInvoices, plays_json_1.default));
function sampleTest(newResponse) {
    const oldResponse = "张三的账单a:$650.00(55)\n" +
        "b:$580.00(35)\n" +
        "c:$500.00(40)\n" +
        "总共消费：$1,730.00\n" +
        "获得积分：47";
    if (oldResponse == newResponse) {
        console.log(" --- 测试通过 --- \n");
    }
    else {
        throw new Error("测试不通过");
    }
}
