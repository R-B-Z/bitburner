/** @param {NS} ns */

export async function main(ns) {

	ns.disableLog('ALL');
	ns.clearLog();

	var stocks = ns.stock.getSymbols();

	while (true) {
		for (var i = 0; i < stocks.length; i++) {
			var stonk = stocks[i];
			var shares = ns.stock.getMaxShares(stonk);
			var price = ns.stock.getPrice(stonk);
			var forecast = ns.stock.getForecast(stonk);
			var money = ns.getServerMoneyAvailable('home');
			var position = ns.stock.getPosition(stonk);
			var shares_owned = position[0];
			var purchasable = Math.round((money / price)*0.9);
			var cost = shares_owned * price;
			let remaining = ns.stock.getMaxShares(stonk) - shares_owned;

			ns.print(`Ticker: ${stonk} \nForecast: ${forecast}\nPrice: ${price}\nPurchasable: ${purchasable}`);

			if (forecast > 0.6 && money > 325000000) {
				if ((shares_owned + purchasable) < shares) ns.stock.buyStock(stonk, purchasable);
				else if ((shares_owned + purchasable) > shares) ns.stock.buyStock(stonk, remaining);
				else ns.print(`Ticker: ${stonk} \nPrice: ${price}\nPurchasable: ${purchasable}`);

			} else if (forecast < 0.5 && shares_owned > 0){
				ns.stock.sellStock(stonk, shares_owned);
				//ns.print('~~~TakeProfit~~~\nStock: ' + stonk + '\nAmount: ' + Math.round(cost/1000000) + 'M\n\n');
			} /*else if (forecast < 0.5 && money > cost && shares_owned == 0) {
				ns.stock.buyShort(stonk, shares);
				ns.print('~~~~Shorted~~~~~\nStock: ' + stonk + '\nCost: ' + Math.round(cost/1000000) + 'M\n\n');
			} else if (forecast > 0.5 && shares_owned > 0) {
				ns.stock.sellShort(stonk, shares);
				ns.print('~~~TakeProfit~~~\nStock: ' + stonk + '\nAmount: ' + Math.round(cost/1000000) + 'M\n\n');
			} */
		}
		await ns.sleep(1);
	}
}