const prefix = "!!";
const Discord = require('discord.js');
const fs = require("fs");
const http = require('http');
const express = require('express');
const app = express();

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
bot.mutes = require("./mutes.json");
bot.levelD = require("./levelD.json");
bot.historyD = require("./historyD.json");
bot.inventory = require("./inventory.json");
onlineTimer = 0;

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

fs.readdir("./commands/", (err, files) => {
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) {
        console.log("No commands to load.");
    }
    console.log(`Loading ${jsfiles.length} commands.`);

    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded.`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("ready", () => {
    console.log(`Bot is ready! ${bot.user.username}`);
    bot.user.setGame("Rune zone duels!")

    bot.setInterval(() => {
        for(let i in bot.mutes) {
            let time = bot.mutes[i].time;
            let guildId = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildId);
            let member = guild.members.get(i);
            let mutedRole = guild.roles.find(r => r.name === "Muted");
            if(!mutedRole) continue;

            if(Date.now() > time && time != null) {
                console.log(`${i} is now able to be unmuted!`);
                member.removeRole(mutedRole);
                delete bot.mutes[i];
                fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
                    if(err) throw err;
                    console.log(`${member.user.tag} has been unmuted.`);
                });
            }
        }

        onlineTimer++;
        for(let i in bot.inventory) {
            let guildId = bot.inventory[i].guild;
            let guild = bot.guilds.get(guildId);
            let member = guild.members.get(i);

            //let currency = bot.inventory[i].currency;

            if(onlineTimer >= 60){
                console.log("A minute has passed");
                onlineTimer = 0;
                if(member.presence.status == "online"){
                    bot.inventory[i].Browncoins++;
                    fs.writeFile("./inventory.json", JSON.stringify(bot.inventory), err => {
                        if(err) throw err;
                        console.log(`${i} has gained 1 currency.`);
                    });
                }
            }
        }
    }, 1000);
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));
    if(cmd) cmd.run(bot, message, args);
    
});

bot.login(process.env.BOT_TOKEN);
