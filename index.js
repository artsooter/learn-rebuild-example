"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plays_json_1 = __importDefault(require("./data/plays.json"));
const order_json_1 = __importDefault(require("./data/order.json"));
function statement(invoice, plays) {
    let totalAmount = 0; // 金额
    let volumeCredits = 0; // 积分
    let result = invoice.customer + "的账单";
    const format = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format;
    for (let order of invoice.order) {
        // 对应的那场表演
        const play = plays[order.playID];
        let thisAmount = 0;
        switch (play.type) {
            case "tragedy": {
                thisAmount = 40000;
                if (order.audienceNumber > 30) {
                    thisAmount += 1000 * (order.audienceNumber - 30);
                }
                break;
            }
            case "comedy": {
                thisAmount = 30000;
                if (order.audienceNumber > 20) {
                    thisAmount += 10000 + 500 * (order.audienceNumber - 20);
                }
                thisAmount += 300 * order.audienceNumber;
                break;
            }
            default:
                throw new Error("未知类型：" + play.type);
        }
        // 计算积分
        volumeCredits += Math.max(order.audienceNumber - 30, 0);
        // 计算额外的积分
        if (play.type === "comedy") {
            volumeCredits += Math.floor(order.audienceNumber / 5);
        }
        result +=
            play.name +
                ":" +
                format(thisAmount / 100) +
                "(" +
                order.audienceNumber +
                ")" +
                "\n";
        totalAmount += thisAmount;
    }
    result += "总共消费：" + format(totalAmount / 100) + "\n";
    result += "获得积分：" + volumeCredits;
    return result;
}
const curInvoices = order_json_1.default[0];
console.log(statement(curInvoices, plays_json_1.default));