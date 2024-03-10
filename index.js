"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plays_json_1 = __importDefault(require("./data/plays.json"));
const order_json_1 = __importDefault(require("./data/order.json"));
function statement(invoice, plays) {
    let result = invoice.customer + "的账单";
    function totalAmount(orders) {
        let result = 0; // 金额
        for (let aOrder of orders) {
            result += amountFor(aOrder);
        }
        return result;
    }
    function totalVolumeCredit(orders) {
        let result = 0; // 积分
        for (let aOrder of orders) {
            result += volumeCreditsFor(aOrder);
        }
        return result;
    }
    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(aNumber / 100);
    }
    function playFor(aOrder) {
        return plays[aOrder.playID];
    }
    function amountFor(aOrder) {
        let result = 0;
        switch (playFor(aOrder).type) {
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
                throw new Error("未知类型：" + playFor(aOrder).type);
        }
        return result;
    }
    function volumeCreditsFor(aOrder) {
        let result = 0;
        // 计算积分
        result += Math.max(aOrder.audienceNumber - 30, 0);
        // 计算额外的积分
        if (playFor(aOrder).type === "comedy") {
            result += Math.floor(aOrder.audienceNumber / 5);
        }
        return result;
    }
    for (let aOrder of invoice.order) {
        result +=
            playFor(aOrder).name +
                ":" +
                usd(amountFor(aOrder)) +
                "(" +
                aOrder.audienceNumber +
                ")" +
                "\n";
    }
    result += "总共消费：" + usd(totalAmount(invoice.order)) + "\n";
    result += "获得积分：" + totalVolumeCredit(invoice.order);
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
