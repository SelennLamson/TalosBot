// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

const schedule = require('node-schedule');

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});
client.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.voiceChannel;
	let oldUserChannel = oldMember.voiceChannel;
	
	if (newUserChannel === oldUserChannel)
		return;
	
	if (oldUserChannel) {
		var textChanName = "";
		if (oldUserChannel.name.startsWith("Débat "))
			textChanName = "débat-" + oldUserChannel.name.substring(6, 7);
		if (oldUserChannel.name.startsWith("Salon "))
			textChanName = "salon-" + oldUserChannel.name.substring(6, 7);
		if (oldUserChannel.id == 438437875504250900)
			if (!newMember.roles.some(r=>["@administrateur", "@modérateur", "@vidéaste"].includes(r.name)))
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
	
	if (newUserChannel) {
		var textChanName = "";
		if (newUserChannel.name.startsWith("Débat "))
			textChanName = "débat-" + newUserChannel.name.substring(6, 7);
		if (newUserChannel.name.startsWith("Salon "))
			textChanName = "salon-" + newUserChannel.name.substring(6, 7);
		if (newUserChannel.id == 438437875504250900)
			if (!newMember.roles.some(r=>["@administrateur", "@modérateur", "@vidéaste"].includes(r.name)))
				newMember.setMute(true);
		if (!textChanName == "") {
			let textChan = client.channels.find("name", textChanName);
			if (textChan)
				textChan.overwritePermissions(newMember.id,{'VIEW_CHANNEL':true});
		}
	}
})
client.on("message", async message => {
  if(message.author.bot) return;
  
  if(message.channel.name == undefined && message.content === "J'ai pris connaissance de la charte et j'en accepte tous les points.") {
	  let member = client.guilds.get("438379867218771968").members.get(message.author.id);
	  if (member.roles.some(r=>["@administrateur", "@modérateur", "@vidéaste", "@membre"].includes(r.name)))
		  return message.reply("Vous êtes déjà membre, merci d'avoir lu la charte ! :smile:");
	  
	  member.addRole("442678135847256080");
	  client.guilds.get("438379867218771968").channels.get("439113892048928790").send(member.displayName + " vient d'accepter la charte");
	  return message.reply("Merci d'avoir lu la charte ! Vous pouvez maintenant écrire dans les channels et vous connecter aux salons vocaux :smile:\n\n" +
							"Allez tout d'abord vous présenter dans le channel dédié !");
  }
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "help") {
	  let staff = message.member.roles.some(r=>["@administrateur", "@modérateur"].includes(r.name));
	  let detail = args[0];
	  var helpText = "";
	  
	  if (detail) {
		  switch (detail) {
			case "help":
				helpText = "La commande **!help** permet d'avoir la liste des commandes qui vous sont disponibles.\n" +
							"Rajoutez le nom de la commande qui vous intéresse pour avoir plus de détails sur son utilisation.\n" +
							"*Exemple : !help ping*";
				break;
			default:
				helpText = "La commande !" + detail + " n'existe pas ou ne vous est pas accessible, désolé !";
				break;
		  }
	  } else {
		helpText = "**Voici la liste des commandes qui vous sont accessibles :**" +
					"\n**!help [command]** : permet d'avoir la liste des commandes disponibles, ainsi que de l'aide sur une commande spécifique." +
					"\n**!ping** : permet de tester le bot et votre connexion au serveur. Je vous répondrai \"Pong !\" si je vous reçois !" +
					"\n**!debat [nom]** : permet de changer le nom du channel de débat dans lequel vous vous trouvez, ou de le réinitialiser.";
		if (staff)
			helpText += "\n\n**Commandes réservées au staff :**" +
					"\n!**chanban <user> <duration> <channel>** : permet de bannir un utilisateur d'un channel vocal pendant un certain temps, en minutes." +
					"\n!**purge <messages>** : permet de supprimer un certain nombre de messages dans le channel textuel où la commande est utilisée.";
		
	  }
	
	message.author.sendMessage(helpText);
  }
  
  if(command === "ping") {
	  message.channel.send("Pong !");
  }
  
  if(command === "uppercut") {
	  message.channel.send("Lord, arrête de me frapper, stp. Je prône la non-violence, en tant que forme de vie non-carbonée.");
  }
  
  if(command === "chanban") {
	  if(!message.member.roles.some(r=>["@administrateur", "@modérateur"].includes(r.name)))
		  return message.reply("je suis désolé mais je n'obéis qu'aux admins et aux modérateurs !");
	  
	  let member = message.mentions.members.first() || message.guild.members.get(args[0]);
	  if (!member)
		  return message.reply("à quel utilisateur voulez-vous que je bloque l'accès à " + message.channel.name + " ?");
	  if (member.roles.some(r=>["@administrateur", "@vidéaste", "@modérateur"].includes(r.name)))
		  return message.reply("il me semble que " + member.displayName + " fait partie du staff, je ne peux pas l'exclure...");
	
	  let delay = parseInt(args[1], 10);
	  if (!delay || delay < 1 || delay > 120)
		  return message.reply("j'ai besoin d'une durée après l'utilisateur à bloquer(entre 1 et 120 minutes).");
	  
	  let chanName = args.slice(2).join(' ');
	  let channel;
	  if (!chanName)
		  return message.reply("il me faut un nom de channel, après le nom de l'utilisateur et la durée.");
	  else
		  channel = client.channels.find("name", chanName);
	  if (!channel)
		  return message.reply("le nom du channel n'est pas reconnu.");
	  
	  channel.overwritePermissions(member.id,{'CONNECT':false});
	  message.reply("j'ai bloqué l'accès vers " + channel.name + " à " + member.displayName + " pour " + delay + " minutes.");
	  
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
  
  /*if(command === "kick") {
    if(!message.member.roles.some(r=>["@administrateur", "@modérateur"].includes(r.name)))
      return message.reply("désolé, je n'obéis qu'aux administrateurs et aux modérateurs !");
    
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("quel utilisateur voulez-vous que je déconnecte ?");
    if(!member.kickable) 
      return message.reply("désolé, je fais de mon mieux mais je ne peux pas le déconnecter.");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Aucune raison indiquée";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`désolé ${message.author}, je n'ai pu expulser personne à cause de : ${error}`));
    message.reply(`${member.user.tag} a été expulsé par ${message.author.tag} en raison de : ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["@administrateur"].includes(r.name)))
      return message.reply("désolé, seuls les administrateurs peuvent bannir des membres.");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("quel utilisateur voulez-vous que je bannisse ?");
    if(!member.bannable) 
      return message.reply("je ne peux pas bannir cet utilisateur, peut-être a-t-il des permissions plus importantes.");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Aucune raison indiquée";
    
    await member.ban(reason)
      .catch(error => message.reply(`désolé ${message.author}, je n'ai pu bannir personne à cause de : ${error}`));
    message.reply(`${member.user.tag} a été banni par ${message.author.tag} en raison de : ${reason}`);
  }*/
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
	if(!message.member.roles.some(r=>["@administrateur", "@modérateur"].includes(r.name)))
		return message.reply("désolé, je n'obéis qu'aux administrateurs et aux modérateurs !");
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("combien de messages voulez-vous que je supprime ? (entre 2 et 100)");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages(deleteCount);
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`je n'ai rien pu supprimer à cause de : ${error}`));
  }
  
  if (command === "debat") {
	if(!message.channel.name.startsWith("débat-"))
		return message.reply("je peux seulement changer le nom des salons de débat.");
	
	let newName = args.join(" ");
	if (!newName)
		newName = "...";
	newName = newName.substring(0, 16);
	
	var voiceChannelNameStart = "Débat " + message.channel.name.substring(6, 7);
	var voiceChannelName = voiceChannelNameStart + " - \"" + newName + "\"";
	
	for (var channel of client.channels) {
		if (channel[1].name.startsWith(voiceChannelNameStart)) {
			channel[1].setName(voiceChannelName);
		}
	}
	
	message.reply("le nom du débat est maintenant \"" + newName + "\" !");
  }
});

client.login(config.token);