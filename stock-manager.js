import { stocks } from "game_info.js";
import { populate, manage_portfolio } from "stock.js";
/** @param {NS} ns */

export async function main(ns) {

	ns.disableLog('ALL');
	ns.clearLog();

	if (ns.stock.hasWSEAccount()) {
		let stonks = populate(ns, stocks(ns));

		while (true) {
			manage_portfolio(ns, stonks);
			await ns.sleep(1);
		}
	}
}