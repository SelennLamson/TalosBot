const botRole = "439113523616808961";
const adminRole = "438380418514026497";
const moderatorRole = "438380476944875522";
const videomakerRole = "438380570125271050";
const memberRole = "442678135847256080";
const everyoneRole = "438379867218771968";

class Utils {
	constructor(client) {
		this.talosLab = client.guilds.get("438379867218771968");
		this.testChan = this.talosLab.channels.get("439113892048928790");
	}
	
	userToMember(user) { return this.talosLab.members.get(user.id); }
	isPM(message) { return message.channel.name == undefined; }

	hasRole(member, rolesIn) { return member.roles.some(r=>rolesIn.includes(r.id)); }
	isAdmin(member) { return this.hasRole(member, [adminRole]); }
	isStaff(member) { return this.hasRole(member, [adminRole, moderatorRole]); }
	isVIP(member) { return this.hasRole(member, [adminRole, moderatorRole, videomakerRole]); }
	isMember(member) { return this.hasRole(member, [adminRole, moderatorRole, videomakerRole, memberRole]); }
	isMemberOnly(member) { return this.hasRole(member, [memberRole]); }
	
	getAdmins() { return this.talosLab.roles.get(adminRole).members; }
	getModerators() { return this.talosLab.roles.get(moderatorRole).members; }
	getVideoMakers() { return this.talosLab.roles.get(videomakerRole).members; }
	getMembersOnly() { return this.talosLab.roles.get(memberRole).members; }
}

module.exports = Utils;