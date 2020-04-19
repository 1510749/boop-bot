const Discord = require('discord.js'); 
const fs = require('fs');

module.exports.run = async (bot, message, args, member) => {
    //check if executor has permission 
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have permission to do this.");

    if(message.content == "!unmute all"){
        for(let i in bot.mutes){
            let guildId = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildId);
            let member = guild.members.get(i);
            let mutedRole = guild.roles.find(r => r.name === "Muted");
            member.removeRole(mutedRole);
            delete bot.mutes[i];
        message.channel.send(`All users have been unmuted`);
        }
    }
    else{
        //get mentioned user, return if none
        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toMute) return message.channel.send("Specify a user mention or ID.");
        //unmute
        let role = message.guild.roles.find(r => r.name === "Muted");

        if(!role || !toMute.roles.has(role.id)) return message.channel.send(`The user ${toMute.user.tag} is not currently muted.`);
        await toMute.removeRole(role);
        delete bot.mutes[toMute.id];
        message.channel.send(`The user ${toMute.user.tag} has been unmuted`);
        console.log(`${toMute.user.tag} has been unmuted.`);
    }

    fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
        if(err) throw err;
        
    });

    
}

module.exports.help = {
    name: "unmute"
}