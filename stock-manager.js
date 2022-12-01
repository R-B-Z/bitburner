import { stocks } from "game_info.js";
import { populate, manage_portfolio, exchange } from "stock.js";
/** @param {NS} ns */

export async function main(ns) {

	ns.disableLog('ALL');
	ns.clearLog();
	let stonks = [];

	while (true) {
		if (exchange.get_WSE(ns)) {
			stonks = populate(ns, stocks(ns));
			manage_portfolio(ns, stonks);
		}
		await ns.sleep(1);
	}
	
}