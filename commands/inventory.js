const Discord = require('discord.js');
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    let inventoryOwner = message.author;
    if(!bot.inventory[inventoryOwner.id]){
        bot.inventory[inventoryOwner.id] = {
            guild : message.guild.id,
            gp : 0,
        }
        fs.writeFile("./inventory.json", JSON.stringify(bot.inventory), err => {
            if(err) throw err;
            message.channel.send("An inventory has been created for you.");
            console.log(`${inventoryOwner.tag}'s inventory has been created.`);
        });
    }
    if(!args[0]){
        let embed = new Discord.RichEmbed()
            .setAuthor(`${inventoryOwner.tag}'s Inventory`)
            .setColor("#005EFF")
            console.log(bot.inventory[inventoryOwner.id]);
            for(i in bot.inventory[inventoryOwner.id]){
                console.log(i)
                if(i != "guild"){
                    embed.addField(`__${i}__ :`, bot.inventory[inventoryOwner.id][i], true);
                }
            }
        return message.channel.send({embed:embed});
    }
    else{
        for(i in bot.inventory[inventoryOwner.id]){
            if(i == args[0]){
                let embed = new Discord.RichEmbed()
                    .setAuthor(`${inventoryOwner.tag}'s Inventory has`)
                    .setColor("#005EFF")
                    console.log(bot.inventory[inventoryOwner.id]);
                    if(i != "guild"){
                        embed.addField(`__${i}__ :`, bot.inventory[inventoryOwner.id][i], true);
                        return message.channel.send({embed:embed});
                    }
            }
        }      
        return message.channel.send("```You do not have any"+ ` ${args[0]}.`+"```")  
    }
}

module.exports.help = {
    name: "inventory"
}
