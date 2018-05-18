class Command {
	constructor() {
		this.calls = ["count"];
		this.help = "Donne le nombre de personnes connectées dans un salon vocal ou textuel.";
		this.args = [["channel", true, "Salon dont les membres doivent êtres comptés."]];
		this.pmOnly = false;
		this.servOnly = false;
	}
	
	hasRole(utils, member) {
		return utils.isStaff(member);
	}
	
	call(utils, message, command, args) {
		let chanName = args.join(' ');
		let channel;
		if (!chanName)
			return message.channel.send("Il me faut un nom de salon dans lequel compter les membres.");
		else
			channel = utils.talosLab.channels.find("name", chanName);
		if (!channel)
			return message.channel.send("Le nom du salon n'est pas reconnu.");
		if (channel.type != "voice" && channel.type != "text")
			return message.channel.send("Ce n'est ni un salon vocal, ni un salon textuel !");
		
		return message.channel.send("Il y a " + channel.members.size + " laborantins connectés dans le salon " + chanName + " !");
	}
}

module.exports = Command;