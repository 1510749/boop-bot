const Discord = require('discord.js'); 
module.exports.run = async (bot, message, args) => {
    let walletOwner = message.author;
    if(!bot.inventory[walletOwner.id]) return message.channel.send("You do not have any wallet");
    message.channel.send("```xl\n" + `You have ${bot.inventory[walletOwner.id].Browncoins} Browncoins.` + "\n```");
}

module.exports.help = {
    name: "wallet"
}