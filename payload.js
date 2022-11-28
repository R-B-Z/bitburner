import { populate } from "server.js";
/** @param {NS} ns */

export async function main(ns) {
	ns.disableLog('ALL');
	ns.clearLog();

	let targets = populate(ns, ['joesguns', 'n00dles']);

	while (true) {
		await targets[0].lend();

		let target = targets[0];

		if (!targets[0].get_root()) target = targets[1];

		ns.print(`\nServer: ${target.hostname}\nSecurity: ${target.get_security_level()}\nMoney: ${target.get_money_available()}\nThreshold: ${target.get_money_threshold()}`);

		if (target.get_security_level() > target.get_security_threshold()) await target.exec_weaken();
		else if (target.get_money_available() < target.get_money_threshold()) await target.exec_grow();
		else await target.exec_hack();
		await ns.sleep(1);
	}

}