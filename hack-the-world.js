import { populate, upgrade_all, infect_all, purchase_all } from "server.js";
import { hackable_servers, player_servers } from "game_info.js";
/** @param {NS} ns */
export async function main(ns) {

	let hosts = hackable_servers.concat(player_servers(ns));
	let servers = populate(ns, hosts);

	ns.disableLog('ALL');
	ns.clearLog();


	while (true) {
		await infect_all(ns, servers);
		if (servers[0].get_purchased_servers().length == servers[0].player_server_limit) {
			await upgrade_all(ns, servers);
		} else {
			await purchase_all(ns);
		}
		await ns.sleep(1);
	}

}