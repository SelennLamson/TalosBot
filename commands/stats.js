class Command {
	constructor() {
		this.calls = ["stats"];
		this.help = "Donne des statistiques sur les utilisateurs du Laboratoire de Talos.";
		this.args = [];
		this.pmOnly = false;
		this.servOnly = false;
	}
	
	hasRole(utils, member) {
		return true;
	}
	
	call(utils, message, command, args) {
		var membersNum = utils.getAdmins().size;
		membersNum += utils.getModerators().size;
		membersNum += utils.getVideoMakers().size;
		membersNum += utils.getMembersOnly().size;
		return message.channel.send("Il y a actuellement " + utils.talosLab.members.size + " utilisateurs dans le Lab, dont " + membersNum + " sont membres ! Et puis il y a moi :3 ");
	}
}

module.exports = Command;