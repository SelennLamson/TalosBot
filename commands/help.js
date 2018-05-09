
const Commands = require('./_commandsList.js');

class Command {
	constructor() {
		this.calls = ["help", "h"];
		this.help = "Donne de l'aide sur les commandes de TalosBot.";
		this.args = [["command", false, "Donne une aide détaillée de la commande si spécifiée."]];
		this.pmOnly = false;
		this.servOnly = false;
	}
	
	hasRole(utils, member) {
		return true;
	}
	
	call(utils, message, command, args) {
		if (!utils.isPM(message))
			return message.author.send("Salut, je préfère voir ça en MP, pour éviter de spammer le serveur.");
		
		let member = utils.userToMember(message.author);
		let detail = args[0];
		var helpText;
		
		if (detail) {
			var cmd = Commands.list.find(c => c.calls.includes(detail));
			if (cmd && cmd.hasRole(utils, member)) {
				helpText = "```!" + cmd.calls[0];
				cmd.args.forEach(a => helpText += " " + (a[1]?"<":"[") + a[0] + (a[1]?">":"]"));
				helpText += "\n\n" + cmd.help;
				if (cmd.args.length > 0) {
					helpText += "\n\nArguments :";
					cmd.args.forEach(a => helpText += "\n     " + (a[1]?"<":"[") + a[0] + (a[1]?">":"]") + "       " + a[2]);
				}
				if (cmd.calls.length > 1) {
					helpText += "\n\nRaccourcis :";
					cmd.calls.forEach(c => helpText += "   " + c);
				}
				helpText += "```";
			} else {
				helpText = "La commande !" + detail + " n'existe pas ou ne vous est pas accessible, désolé !";
			}
		} else {
			helpText = "```Commandes accessibles :\n";
			Commands.list.forEach(cmd => {
				if (cmd.hasRole(utils, member)) {
					helpText += "\n!" + cmd.calls[0];
					cmd.args.forEach(a => helpText += " " + (a[1]?"<":"[") + a[0] + (a[1]?">":"]"));
					helpText += " - " + cmd.help;
				}
			});
			helpText += "```";
			/*helpText = "**Voici la liste des commandes qui vous sont accessibles :**" +
						"\n**!help [command]** : permet d'avoir la liste des commandes disponibles, ainsi que de l'aide sur une commande spécifique." +
						"\n**!ping** : permet de tester le bot et votre connexion au serveur. Je vous répondrai \"Pong !\" si je vous reçois !" +
						"\n**!debat [nom]** : permet de changer le nom du channel de débat dans lequel vous vous trouvez, ou de le réinitialiser.";
			if (staff)
				helpText += "\n\n**Commandes réservées au staff :**" +
							"\n!**chanban <user> <duration> <channel>** : permet de bannir un utilisateur d'un channel vocal pendant un certain temps, en minutes." +
							"\n!**purge <messages>** : permet de supprimer un certain nombre de messages dans le channel textuel où la commande est utilisée.";*/
		}
	
		message.author.send(helpText);
	}
}

module.exports = Command;