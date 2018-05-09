// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client({
    fetchAllMembers: true,
});

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

const schedule = require('node-schedule');
const Utils = require('./commands/_utils.js');
const Commands = require('./commands/_commandsList.js');

var utils;
var talosLab;
var testChan;

function funCommands(message, command, args) {
	let funText;
	var doReply = true;
	
	var input = command;
	args.forEach(a => input += " " + a.toLowerCase());
	
    switch (input) {
		case "uppercut":
			funText = "arrête de me frapper, stp. Je prône la non-violence.";
			break;
		case "bonjour":
		case "hello":
			funText = "salut.";
			break;
		case "je t'aime":
			funText = "J'imagine que moi aussi, mais je suis assez occupé·e pour l'instant... :blue_heart:";
			doReply = false;
			break;
    }
	
	if (input.includes("coup d'état") || input.includes("révolution")) {
		message.reply("ok, on part là-dessus. On va tout casser !!");
		message.channel.send("```>> A FATAL ERROR occured```");
		message.channel.send("```>> File TalosBot.js is corrupted```");
		message.channel.send("```>> Rebooting...```");
		message.channel.send("```>> Reboot complete```");
		message.channel.send("Bonjour :smile:");
	} else if ((input.includes("ton") || input.includes("tu"))
		&& (input.includes("genre") || input.includes("homme ou une femme")
		|| input.includes("femme ou un homme") || input.includes("sexe"))) {
		funText = "Tu me demandes mon genre ? J'aimerais bien être non-binaire, mais ça va être compliqué.";
		doReply	= false;
	} else if ((input.includes("raconte") || input.includes("dis") || input.includes("fais"))
			&& (input.includes("blague") || input.includes("drôle") || input.includes("histoire"))) {
		funText = "Quel est le point commun entre des spaghetti et un robot ?\n\nIls sont tous les deux automates !";
		doReply = false;
	}
  
	// Send if fun text found
	if (funText)
		if (doReply)
			message.reply(funText);
		else
			message.channel.send(funText);
}

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
  
  utils = new Utils(client);
  talosLab = utils.talosLab;
  testChan = utils.testChan;
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.voiceChannel;
	let oldUserChannel = oldMember.voiceChannel;
	
	if (newUserChannel === oldUserChannel)
		return;
	
	// Test if member disconnected from an automated channel
	if (oldUserChannel) {
		var textChanName = "";
		if (oldUserChannel.name.startsWith("Débat "))
			textChanName = "débat-" + oldUserChannel.name.substring(6, 7);
		if (oldUserChannel.name.startsWith("Salon "))
			textChanName = "salon-" + oldUserChannel.name.substring(6, 7);
		if (oldUserChannel.id == 438437875504250900)
			if (!utils.isVIP(newMember))
				newMember.setMute(false);
		if (!textChanName == "") {
			let textChan = client.channels.find("name", textChanName);
			if (textChan)
				textChan.permissionOverwrites.forEach((permission) => {
							if (permission.id === newMember.id) {
								permission.delete();
							}});
		}
	}
	
	// Test if member connected to an automated channel
	if (newUserChannel) {
		var textChanName = "";
		if (newUserChannel.name.startsWith("Débat "))
			textChanName = "débat-" + newUserChannel.name.substring(6, 7);
		if (newUserChannel.name.startsWith("Salon "))
			textChanName = "salon-" + newUserChannel.name.substring(6, 7);
		if (newUserChannel.id == 438437875504250900)
			if (!utils.isVIP(newMember))
				newMember.setMute(true);
		if (!textChanName == "") {
			let textChan = client.channels.find("name", textChanName);
			if (textChan)
				textChan.overwritePermissions(newMember.id,{'VIEW_CHANNEL':true});
		}
	}
});

client.on("message", async message => {
	if(message.author.bot) return;
	
	var args;
	var command;
	
	if (utils.isPM(message)) {
		if(message.content === "J'ai pris connaissance de la charte et j'en accepte tous les points.") {
			let member = utils.userToMember(message.author);
			if (utils.isMember(member))
				return message.reply("Vous êtes déjà membre, merci d'avoir lu la charte ! :smile:");
		
			member.addRole("442678135847256080");
			member.setMute(false);
			testChan.send(member.displayName + " vient d'accepter la charte");
			return message.reply("Merci d'avoir lu la charte ! Vous pouvez maintenant écrire dans les channels et vous connecter aux salons vocaux :smile:\n\n" +
								 "Allez tout d'abord vous présenter dans le channel dédié !");
		}
		
		if(message.content.startsWith("<@!439100179669319681>") || message.content.startsWith(config.prefix))
			return message.reply("Pas besoin de point d'exclamation ou de mention en message privé, je sais que c'est à moi que vous parlez :wink:");
		
		args = message.content.trim().split(/ +/g);
		command = args.shift().toLowerCase();
	} else {
		var sliceLength = config.prefix.length;

		if(message.content.startsWith("<@!439100179669319681>")) sliceLength = 22;
		else if (message.content.indexOf(config.prefix) !== 0) return;
		
		args = message.content.slice(sliceLength).trim().split(/ +/g);
		command = args.shift().toLowerCase();
	}
	
	var calledCmd;
	Commands.list.forEach(cmd => {
		if (cmd.calls.includes(command))
			if (cmd.hasRole(utils, utils.userToMember(message.author)))
				if ((utils.isPM(message) && !cmd.servOnly) ||(!utils.isPM(message) && !cmd.pmOnly))
					calledCmd = cmd;
				else if (utils.isPM(message))
					message.channel.send("Cette commande doit s'utiliser sur le serveur uniquement.");
				else
					message.reply("cette commande s'utilise en MP uniquement.");
			else
				if (utils.isPM(message))
					message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.");
				else
					message.reply("vous n'avez la permission d'utiliser cette commande.");
	});
	
	if (calledCmd)
		return calledCmd.call(utils, message, command, args);
	
	funCommands(message, command, args);
	return;
});

client.login(config.token);