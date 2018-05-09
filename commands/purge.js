class Command {
	constructor() {
		this.calls = ["purge"];
		this.help = "Supprime des messages dans le channel où la commande est utilisée.";
		this.args = [["quantity", true, "Nombre de messages à supprimer (entre 2 et 100)."]];
		this.pmOnly = false;
		this.servOnly = true;
	}
	
	hasRole(utils, member) {
		return utils.isStaff(member);
	}
	
	call(utils, message, command, args) {
		// get the delete count, as an actual number.
		const deleteCount = parseInt(args[0], 10);
		
		// Ooooh nice, combined conditions. <3
		if(!deleteCount || deleteCount < 2 || deleteCount > 100)
			return message.reply("combien de messages voulez-vous que je supprime ? (entre 2 et 100)");
		
		// So we get our messages, and delete them. Simple enough, right?
		purgeMessages(message.channel, deleteCount);
	}
}

async function purgeMessages(channel, count) {
	const fetched = await channel.fetchMessages({ limit: count });
	channel.bulkDelete(fetched)
		.catch(error => channel.send("Je n'ai rien pu supprimer à cause de : " + error));
}

module.exports = Command;