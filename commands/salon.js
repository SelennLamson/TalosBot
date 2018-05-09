class Command {
	constructor() {
		this.calls = ["salon"];
		this.help = "Change le nom du salon vocal de discussion, depuis le salon textuel lié.";
		this.args = [["sujet", false, "Nouveau nom du sujet. Si non renseigné, il est réinitialisé à \"...\"."]];
		this.pmOnly = false;
		this.servOnly = true;
	}
	
	hasRole(utils, member) {
		return true;
	}
	
	call(utils, message, command, args) {
		if(!message.channel.name.startsWith("salon-"))
			return message.reply("je peux seulement changer le nom des salons de discussion.");
		
		let newName = args.join(" ");
		if (!newName)
			newName = "...";
		newName = newName.substring(0, 16);
		
		var voiceChannelNameStart = "Salon " + message.channel.name.substring(6, 7);
		var voiceChannelName = voiceChannelNameStart + " - \"" + newName + "\"";
		
		for (var channel of utils.talosLab.channels) {
			if (channel[1].name.startsWith(voiceChannelNameStart)) {
				channel[1].setName(voiceChannelName);
			}
		}
		
		message.reply("le sujet du salon est maintenant \"" + newName + "\" !");
	}
}

module.exports = Command;