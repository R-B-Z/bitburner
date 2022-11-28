/** @param {NS} ns */

export function user(ns) {
	return {
		hostname: 'home',
		server_count: 0,
		server_limit: 25,
		get_money: function () { return ns.getServerMoneyAvailable('home'); },
		get_level: function () { return ns.getHackingLevel(); },
		get_tools: function () { let owned = []; for (let exploit of ['BruteSSH.exe', 'FTPCrack.exe', 'RelaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe']) { if (ns.fileExists(exploit)) owned.push(exploit); } return owned; }
	};
}