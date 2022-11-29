import { user } from "player.js";
/** @param {NS} ns */

export function create_stock(ns, stonk) {
    return {
        symbol: stonk,
        get_WSE: function () { return ns.stock.hasWSEAccount(); },
        get_4SData: function () { return ns.stock.has4SData(); },
        get_TIX: function () { return ns.stock.hasTIXAPIAccess(); },
        get_shares: function () { return ns.stock.getMaxShares(this.symbol); },
        get_price: function () { return ns.stock.getPrice(this.symbol); },
        get_forecast: function () { return ns.stock.getForecast(this.symbol); },
        get_position: function () { return ns.stock.getPosition(this.symbol); },
        get_shares_owned: function () { return this.get_position()[0]; },
        get_purchasable: function () { return Math.round(user(ns).get_money() / this.get_price()*0.9) },
        get_cost: function () { return this.get_shares_owned() * this.get_price(); },
        get_remaining_shares: function () { return ns.stock.getMaxShares(this.symbol) - this.get_shares_owned(); },
        long: function () { 
            if ((this.get_shares_owned() + this.get_purchasable()) < this.get_shares()) ns.stock.buyStock(stonk, this.get_purchasable());
            else if ((this.get_shares_owned() + this.get_purchasable()) > this.get_shares()) ns.stock.buyStock(stonk, this.get_remaining_shares());
        },
        sell_long: function () { 
            if (this.get_forecast() < 0.5 && this.get_shares_owned() > 0) ns.stock.sellStock(this.symbol, this.get_shares_owned());			
        },
    };
}

export function populate(ns, stocks) {
    let stonks = [];
    for (let stonk of stocks) {
        stonks.push(create_stock(ns, stonk));
    }
    return stonks;
}

export function buy_all(ns, stocks) {
    for (let stock of stocks) {
        if (stock.get_forecast() > 0.6 && user(ns).get_money() > 325000000) stock.long();
    }
}

export function sell_all(ns, stocks) {
    for (let stock of stocks) {
        if (stock.get_forecast() < 0.5) {
            stock.sell_long();
        }
    }
}

export function manage_portfolio(ns, stocks) {
    if (stocks[0].get_WSE()) {
        buy_all(ns, stocks);
        sell_all(ns, stocks);
    }
}