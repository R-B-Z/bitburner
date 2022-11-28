import { populate } from 'node.js';
/** @param {NS} ns **/
export async function main(ns) {

	let nodes = populate(ns, 100);

	ns.disableLog('ALL');
	ns.clearLog();

	while (true) {
		for (let node of nodes) {
			node.purchase();
			node.upgrade();
		}
		await ns.sleep(1);
	}

}