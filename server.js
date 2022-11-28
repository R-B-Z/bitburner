/** @param {NS} ns */
export function server(ns, host, ram) {
	return {
		hostname: host,
		memory: ram,
		infected: false,
		upgraded: false,
		get_memory_upgrade: function () { return this.memory * 2; },
		memory_limit: 2 ** 20,
		player_server_limit: 25,
		owned_prefix: 'zombie-',
		dependencies: ['server.js', 'player.js', 'node.js'],
		scripts: ['stock-manager.js', 'hacknet.js', 'payload.js'],
		exploits: ['BruteSSH.exe', 'FTPCrack.exe', 'RelaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'],
		get_root: function () { return ns.hasRootAccess(this.hostname); },
		get_money_available: function () { return ns.getServerMoneyAvailable(this.hostname); },
		get_money_threshold: function () { return this.get_max_money() * 0.75; },
		get_security_threshold: function () { return this.get_min_security() + 5; },
		get_max_money: function () { return ns.getServerMaxMoney(this.hostname); },
		get_security_level: function () { return ns.getServerSecurityLevel(this.hostname); },
		get_min_security: function () { return ns.getServerMinSecurityLevel(this.hostname); },
		get_opened_ports: function () { return ns.getServer(this.hostname).openPortCount; },
		get_required_ports: function () { return ns.getServerNumPortsRequired(this.hostname); },
		get_required_level: function () { return ns.getServerRequiredHackingLevel(this.hostname); },
		get_thread_count: function () { return Math.floor((this.memory - this.get_used_memory()) / this.get_script_memory()); },
		get_upgrade_cost: function () { return ns.getPurchasedServerCost(this.get_memory_upgrade()); },
		destroy: function () { if (this.get_purchased_servers().includes(this.hostname)) ns.deleteServer(this.hostname); },
		purchase: function () { ns.purchaseServer(this.hostname, this.memory); },
		get_used_memory: function () { return ns.getServerUsedRam(this.hostname); },
		get_script_memory: function () { return ns.getScriptRam('payload.js'); },
		run_scripts: function () { this.fetch_dependencies(); for (let script of this.scripts) { if (!ns.isRunning(script, this.hostname)) { ns.scp(script, this.hostname); if (script == 'payload.js') { ns.exec(script, this.hostname, this.get_thread_count()); } else if (this.hostname == 'home') { ns.exec(script, this.hostname, 1); } } } },
		stop_scripts: function () { if (this.get_purchased_servers().includes(this.hostname)) ns.killall(this.hostname); },
		upgrade: function () { this.memory = this.get_memory_upgrade(); this.stop_scripts(); this.destroy(); this.purchase(); this.run_scripts(); },
		infect: function () { if (this.hostname.includes(this.owned_prefix)) this.infected = true; if (!this.infected && this.get_opened_ports() <= this.get_required_ports()) { if (ns.getHackingLevel() >= this.get_required_level()) { if (ns.fileExists(this.exploits[0], 'home')) ns.brutessh(this.hostname); if (ns.fileExists(this.exploits[1], 'home')) ns.ftpcrack(this.hostname); if (ns.fileExists(this.exploits[2], 'home')) ns.relaysmtp(this.hostname); if (ns.fileExists(this.exploits[3], 'home')) ns.httpworm(this.hostname); if (ns.fileExists(this.exploits[4], 'home')) ns.sqlinject(this.hostname); } } if (this.get_opened_ports() >= this.get_required_ports() && !this.get_root()) { ns.nuke(this.hostname); this.infected = true; } if (this.get_root()) this.infected = true; if (this.infected) { if (this.get_thread_count() > 0) this.run_scripts(); return 1; } else { return 0; } },
		lend: async function () { await ns['share'](); },
		exec_hack: async function () { await ns['hack'](this.hostname); },
		exec_grow: async function () { await ns['grow'](this.hostname); },
		exec_weaken: async function () { await ns['weaken'](this.hostname); },
		fetch_dependencies: function () { for (let d of this.dependencies) { ns.scp(d, this.hostname, 'home'); } },
		get_purchased_servers: function () { return ns.getPurchasedServers(); },
	};
}

export function populate(ns, hosts, ram = 8) {
	let servers = [];
	ns.print(hosts);
	for (let host of hosts) {
		if (ns.serverExists(host)) servers.push(server(ns, host, ns.getServerMaxRam(host)));
		else servers.push(server(ns, host, ram));
	}
	
	return servers;
}

export async function upgrade_all(ns, hosts) {
	for (let server of hosts) {
		if (server.hostname.includes(server.owned_prefix)) {
			if (server.memory_limit == server.memory) {
				server.upgraded = true;
			} else if (ns.getServerMoneyAvailable('home') > server.get_upgrade_cost()) {
				server.upgrade();
			}
		}
	}
	await ns.sleep(1);
}

export async function infect_all(ns, hosts) {
	for (let victim of hosts) { if (!victim.infected && ns.serverExists(victim.hostname)) victim.infect(); } await ns.sleep(1);
}

export async function purchase_all(ns) {
	let template = server(ns, 1);
	for (let x = 0; x < 25; x++) {
		if (!template.get_purchased_servers().includes(template.owned_prefix + x)) ns.purchaseServer(template.owned_prefix + x, 8);
	}
}