const schedule = require('node-schedule');

class Command {
	constructor() {
		this.calls = ["chanban"];
		this.help = "Banni temporairement quelqu'un d'un salon vocal.";
		this.args = [["member", true, "Personne à bannir."],
					 ["delay", true, "Délai en minutes pendant lequel la personne sera bannie (entre 1 et 120 minutes)."],
					 ["channel", true, "Nom du channel vocal (avec espaces si nécessaire) duquel bannir la personne."]];
		this.pmOnly = false;
		this.servOnly = true;
	}
	
	hasRole(utils, member) {
		return utils.isStaff(member);
	}
	
	call(utils, message, command, args) {
		let member = message.mentions.members.first() || message.guild.members.get(args[0]);
		if (!member)
			return message.reply("à quel utilisateur voulez-vous que je bloque l'accès à " + message.channel.name + " ?");
		if (utils.isVIP(member))
			return message.reply("il me semble que " + member.displayName + " fait partie du staff, je ne peux pas l'exclure...");
		
		let delay = parseInt(args[1], 10);
		if (!delay || delay < 1 || delay > 120)
			return message.reply("j'ai besoin d'une durée après l'utilisateur à bloquer(entre 1 et 120 minutes).");
		
		let chanName = args.slice(2).join(' ');
		let channel;
		if (!chanName)
			return message.reply("il me faut un nom de channel, après le nom de l'utilisateur et la durée.");
		else
			channel = utils.talosLab.channels.find("name", chanName);
		if (!channel)
			return message.reply("le nom du channel n'est pas reconnu.");
		
		channel.overwritePermissions(member.id,{'CONNECT':false});
		message.reply("j'ai bloqué l'accès vers " + channel.name + " à " + member.displayName + " pour " + delay + " minutes.");
		member.setVoiceChannel(utils.talosLab.channels.get("438425196949667840"));
		
		var unbanTime = new Date();
		unbanTime = new Date(unbanTime.getTime() + (1000 * 60 * delay));
		schedule.scheduleJob(unbanTime, function(){
			channel.permissionOverwrites.forEach((permission) => {
				if (permission.id === member.id) {
					permission.delete();
					message.reply("je viens de debloquer l'accès vers " + channel.name + " à " + member.displayName + ".");
				}});
			});
	}
}

module.exports = Command;