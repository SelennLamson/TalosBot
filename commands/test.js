class Command {
	constructor() {
		this.calls = ["test"];
		this.help = "Commande de test générale.";
		this.args = [];
		this.pmOnly = false;
		this.servOnly = false;
	}
	
	hasRole(utils, member) {
		return member.id === "228597699895754753";
	}
	
	call(utils, message, command, args) {
		message.channel.send("Pas de test en vue !");
	}
}

module.exports = Command;