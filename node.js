import { user } from 'player.js';
/** @param {NS} ns */

export function node(ns, name) {
		return {
			hostname: name,
			core: 1,
			ram: 1,
			cache: 1,
			level: 1,
			hash: 0,
			max_level: 200,
			max_ram: 64,
			max_core: 16,
			get_nodes: function () { return ns.hacknet.numNodes(); },
			get_limit: function () { return ns.hacknet.maxNumNodes(); },
			get_cost: function () { return ns.hacknet.getPurchaseNodeCost(); },
			update_stats: function () { if (this.get_nodes() > this.hostname) { let stats = ns.hacknet.getNodeStats(this.hostname); this.level = stats.level; this.core = stats.cores; this.cache = stats.cache; this.ram = stats.ram; this.hash = stats.hashCapacity; } },
			get_level_upgrade_cost: function () { return ns.hacknet.getLevelUpgradeCost(this.hostname, this.level); },
			get_core_upgrade_cost: function () { return ns.hacknet.coreUpgradeCost(this.hostname, this.core); },
			get_ram_upgrade_cost: function () { return ns.hacknet.getRamUpgradeCost(this.hostname, this.ram); },
			get_upgrade_cost: function () { return ns.hacknet.getCacheUpgradeCost(this.hostname, this.cache); },
			purchase: function () { if (user(ns).get_money() > this.get_cost()) return ns.hacknet.purchaseNode(); },
			upgrade: function () { if (this.get_nodes() > this.hostname) { this.update_stats(); if (this.level < this.max_level) ns.hacknet.upgradeLevel(this.hostname, this.level + 1); if (this.core < this.max_core) ns.hacknet.upgradeCore(this.hostname, this.core + 1); if (this.ram < this.max_ram) ns.hacknet.upgradeRam(this.hostname, this.ram + 1); } }
		};
}

export function populate(ns, count) {
	let servers = [];
	for (let i = 0; i < count; i++) {
		servers.push(node(ns, i));
	}
	return servers;
}