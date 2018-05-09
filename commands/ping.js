class Command {
	constructor() {
		this.calls = ["ping", "p"];
		this.help = "Permet de tester le bot (renvoie \"Pong !\").";
		this.args = [];
		this.pmOnly = false;
		this.servOnly = false;
	}
	
	hasRole(utils, member) {
		return true;
	}
	
	call(utils, message, command, args) {
		return message.channel.send("Pong !");
	}
}

module.exports = Command;