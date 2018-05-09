class Command {
	constructor() {
		this.calls = ["say", "s"];
		this.help = "Fait parler le bot dans le channel indiqué.";
		this.args = [["channel", true, "Salon textuel dans lequel le bot va parler."],
					 ["text", true, "Ce que le bot va dire."]];
		this.pmOnly = false;
		this.servOnly = false;
	}
	
	hasRole(utils, member) {
		return utils.isStaff(member);
	}
	
	call(utils, message, command, args) {
		if (!args[0])
			return message.channel.send("Vous devez spécifier un channel où envoyer le texte.");
		if (!args[1])
			return message.channel.send("Vous devez spécifier un texte à envoyer, après le channel.");
		
		let chan = utils.talosLab.channels.find("name", args[0]);
		
		if (chan)
			chan.send(args.slice(1).join(" "));
		else
			message.channel.send("Le channel n'a pas été trouvé.");
	}
}

module.exports = Command;