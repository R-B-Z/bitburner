import { stocks, manage_portfolio } from "game_info.js";
import { populate } from "stock.js";
/** @param {NS} ns */

export async function main(ns) {

	ns.disableLog('ALL');
	ns.clearLog();

	let stonks = populate(ns, stocks(ns));

	while (true) {
		manage_portfolio(stonks);
		await ns.sleep(1);
	}
}