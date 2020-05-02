const Discord = require('discord.js');
const fs = require("fs");

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function wait(ms){
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while(d2-d < ms);
}

accept = "✅";
decline = "❎";

module.exports.run = async (bot, message, args) => {
    healthZero = 99;
    healthOne = 99;
    var bodyActions = ["slices", "stabs", "jousts", "crushes", "used magic on", "used prayer on", "claws", "attacks", "smacked", "rushed", "froze"];
    var bodyParts = ["foot", "head", "elbow", "thigh", "toes", "thumb", "fingers", "finger", "palm",
        "ear", "nose", "knee", "ankle", "shoulder", "face", "hand", "butt", "belly button", "stolen car"];

    var withActions = ["slices", "stabs", "jousts", "claws"];
    var projectileActions = ["throws a", "yeets a", "catapults a", "fires a"];
    var firesALaunchers = ["hand cannon", "twisted bow", "dragon crossbow", "longbow", "shortbow", "Compound now", "slingshot", "ballista"];
    var items = ["rock","spear", "scimitar", "arrow", "bolt", "wooden crate", "metal box", "pot", "stick", "keyboard",
        "monitor", "cannonball", "volleyball", "KNOWLEDGE", "Coke", "Pepsi", "basketball",
        "pencil", "pen", "staple", "ceramic pot", "paperclip", "iPhone 4S", "shuriken"];

    var duelEE = message.author;
    var toDuel = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    
    if( !toDuel && args[1] == undefined && args[0] != "profile" && args[0] != "history"){
        return message.channel.send("Specify a user mention or ID.");
    }
    else if(!toDuel && args[0] == "history"){
        var embed = new Discord.RichEmbed();
        embed.setColor("#ecbe00");
        for(i in bot.historyD){
            embed.addField(bot.historyD[i].outcome, bot.historyD[i].time, false);
        }
        return message.channel.send({embed: embed});
    }
    else if (args[0] == "profile" && !toDuel){
        if(bot.levelD[duelEE.id] == undefined){
            return message.channel.send(`You do not have a profile.`);
        }
        else{        
            console.log("Author's profile");
            var embed = new Discord.RichEmbed()
                .setAuthor(`${duelEE.username}`)
                .setTitle(`Level ${bot.levelD[duelEE.id].level}`)
                .setDescription(`Exp: ${bot.levelD[duelEE.id].exp}\nWins: ${bot.levelD[duelEE.id].wins}\nLosses: ${bot.levelD[duelEE.id].losses}`)
                .setColor("#633092")
                .setThumbnail(duelEE.displayAvatarURL)
            return message.channel.send({embed: embed});
        }
    }
    else if( args[1] == "profile" && toDuel.user.tag != bot.user.tag){
        if(bot.levelD[toDuel.id] == undefined){
            return message.channel.send(`${toDuel.user.tag} does not have a profile.`);
        }
        else{
            console.log("User's profile");
            var embed = new Discord.RichEmbed()
                .setAuthor(`${toDuel.user.username}`)
                .setTitle(`Level ${bot.levelD[toDuel.id].level}`)
                .setDescription(`Exp: ${bot.levelD[toDuel.id].exp}\nWins: ${bot.levelD[toDuel.id].wins}\nLosses: ${bot.levelD[toDuel.id].losses}`)
                .setColor("#633092")
                .setThumbnail(toDuel.user.displayAvatarURL)
            return message.channel.send({embed: embed});
        }
    }
    else if(toDuel.user.tag == bot.user.tag && args[1] == "profile"){
        return message.channel.send("The bot does not have a profile.");
    }
    else if(toDuel.user.tag == bot.user.tag && args[1] != "profile"){
        return message.channel.send("You may not duel the bot.");
    }
    else if(toDuel.user.tag == duelEE.tag && args[1] != "profile"){
        return message.channel.send("You may not duel yourself.");
    }

    for(let i in bot.levelD) {
        let guildId = bot.levelD[i].guild;
        let guild = bot.guilds.get(guildId);
        let level = bot.levelD[i].level;
        let exp = bot.levelD[i].exp;
        let wins = bot.levelD[i].wins;
        let losses = bot.levelD[i].losses;
    };
    if (!bot.levelD[toDuel.id]){
        bot.levelD[toDuel.id] = {
            guild: message.guild.id,
            exp: 0,
            level: 1,
            wins: 0,
            losses: 0
        }
    }
    if (!bot.levelD[duelEE.id]){
        bot.levelD[duelEE.id] = {
            guild: message.guild.id,
            exp: 0,
            level: 1,
            wins: 0,
            losses: 0
        }
    }

    for(let i in bot.historyD) {
        let outcome = ""
        let time = bot.historyD[i].time;
    };

    fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
        if(err) throw err; 
        console.log(`${toDuel.user.tag} has been challenged to a duel.`)
    });

    function win_check(toDuel1, toDuel2, duelEE1, duelEE2, attackerHP, defenderHP){
        gameTime = new Date();
        options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: "America/Los_Angeles", hour12: true}
        historyDlength = 0;
        if(defenderHP < 1 ){
            done = true;
            if(toDuel2 != duelEE2){
                message.channel.send("```md\n" + "# Duel Complete #\n" + `${toDuel2}(${attackerHP}hp) has won the duel against ${duelEE2}` + "\n```");
                bot.levelD[toDuel1].exp += 10;
                bot.levelD[toDuel1].level = Math.floor(0.2 * Math.sqrt(bot.levelD[toDuel1].exp)) + 1;
                bot.levelD[toDuel1].wins += 1;
                bot.levelD[toDuel1].losses += 0;

                bot.levelD[duelEE1].exp += 5;
                bot.levelD[duelEE1].level = Math.floor(0.2 * Math.sqrt(bot.levelD[duelEE1].exp)) + 1;
                bot.levelD[duelEE1].wins += 0;
                bot.levelD[duelEE1].losses += 1;
                fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
                    if(err) throw err; 
                    console.log(`Data saved.`);
                });

                bot.inventory[toDuel1].currency += 20; console.log(`${toDuel1} has won 20 currency`);
                bot.inventory[duelEE1].currency += 10; console.log(`${duelEE1} has won 10 currency`);
                fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                    if(err) throw err; 
                    console.log(`Currency saved.`);
                });
                for(i in bot.historyD){
                    historyDlength ++
                }
                console.log(historyDlength);
                if(bot.historyD[0]){
                    for(let x=historyDlength-1; x >= 0; x--){
                        bot.historyD[x+1] = {
                            outcome : bot.historyD[x].outcome,
                            time : bot.historyD[x].time
                        }
                    }
                }
                bot.historyD[0] = {
                    outcome: `${toDuel2}(${attackerHP}hp) has won the duel against ${duelEE2}`,
                    time : `${gameTime.getDay()} ${gameTime.getMonth()} ${gameTime.getDate()} ${gameTime.getYear()}
                    ${gameTime.getHours()}:${gameTime.getMinutes()}:${gameTime.getSeconds()}`
                }
                fs.writeFile("./historyD.json", JSON.stringify(bot.historyD, null, 4), err => {
                    if(err) throw err; 
                    console.log(`HistoryD saved.`);
                });

            }
            else{
                message.channel.send("```md\n" + "# Test Duel Complete (No Rewards) #\n" + `${toDuel2}(${attackerHP}hp) has won the duel against ${duelEE2}` + "\n```");
                // for(i in bot.historyD){
                //     historyDlength ++
                // }
                // console.log(historyDlength);
                // if(bot.historyD[0]){
                //     for(let x=historyDlength-1; x >= 0; x--){
                //         bot.historyD[x+1] = {
                //             outcome : bot.historyD[x].outcome,
                //             time : bot.historyD[x].time
                //         }
                //     }
                // }
                // bot.historyD[0] = {
                //     outcome: `*Test Duel* ${toDuel2}(${attackerHP}hp) has won the duel against ${duelEE2}`,
                //     time : gameTime.toLocaleDateString('en-US', options)
                // }
                // if(bot.historyD[10]){
                //     delete bot.historyD[10];
                // }
                // fs.writeFile("./historyD.json", JSON.stringify(bot.historyD, null, 4), err => {
                //     if(err) throw err; 
                //     console.log(`Data saved.`);
                // });
            }
        }
    }
    async function play(toDuel1, duelEE1, attackerHP, defenderHP, color){
            const specificActions = [`${toDuel1} (${defenderHP}hp) convinced ${duelEE1} (${attackerHP}hp) to not commit suicide`,
            `${toDuel1} (${defenderHP}hp) took ${duelEE1} (${attackerHP}hp) to McDonalds`,
            `${toDuel1} (${defenderHP}hp) took ${duelEE1} (${attackerHP}hp) to Walmart`,
            `${toDuel1} (${defenderHP}hp) installed Vosteran on ${duelEE1} (${attackerHP}hp)'s computer`,
            `${toDuel1} (${defenderHP}hp) downvoted ${duelEE1} (${attackerHP}hp)'s Reddit post`,
            `${toDuel1} (${defenderHP}hp) gave ${duelEE1} (${attackerHP}) trypophobia`,
            `${toDuel1} (${defenderHP}hp) pointed a laser at ${duelEE1} (${attackerHP}), a cat scratched him`,
            `${toDuel1} (${defenderHP}hp) pushed ${duelEE1} (${attackerHP}) into a lake`];
            
            let scenario = await randomInt(0,3);
            console.log(scenario);
            if(scenario == 0){
                withActionSlot = randomInt(0, withActions.length -1);
                itemUsed = randomInt(0, items.length -1);
                if (withActionSlot == 0){
                    damage = randomInt(12,20);
                }
                else if (withActionSlot == 1){
                    damage = randomInt(12,15);
                }
                else{
                    damage = randomInt(8,15);
                }
                await console.log(damage, attackerHP, defenderHP);
                var embed = await new Discord.RichEmbed()
                    .setTitle(`${toDuel1} (${defenderHP}hp)`)
                    .setDescription(`${toDuel1} ${withActions[withActionSlot]} ${duelEE1}(${attackerHP}hp) with a ${items[itemUsed]} dealing ${damage} damage.`)
                    .setColor(color)
                await message.channel.send({embed: embed});
                // await message.channel.send(
                //     "```html\n" + //`<${toDuel1} (${defenderHP}hp)>\n`+ 
                //     `<${toDuel1} (${defenderHP})> ${withActions[withActionSlot]} <${duelEE1} (${attackerHP}hp)> with a ${items[itemUsed]} dealing ${damage} damage.`
                //      + "```"
                // );
                wait(1500);
                return attackerHP -= damage;

            }
            else if(scenario == 1){
                itemUsed = randomInt(0, items.length -1);
                bodyHit = randomInt(0,bodyParts.length -1);
                projectileActionSlot = randomInt(0,projectileActions.length -1);
                projectile = randomInt(0, firesALaunchers.length-1);

                if(projectileActions[projectileActionSlot] == "fires a"){
                    item = firesALaunchers[projectile];
                }
                else{ item = items[itemUsed]}

                if(bodyParts[bodyHit] == "head" || bodyParts[bodyHit] == "crotch"){
                    damage = randomInt(10,25);
                }
                else {damage = randomInt(0,99);}//100% attack(note: randomInt is inclusive) 

                if(damage <= 9){//10%miss chance
                    damage = 0;
                    damageStatement = `missing`;
                }
                else{
                    damage = randomInt(12,16);
                    damageStatement = `dealing ${damage} damage`;
                }
                await console.log(damage, attackerHP, defenderHP);
                var embed = await new Discord.RichEmbed()
                    .setTitle(`${toDuel1} (${defenderHP}hp)`)
                    .setDescription(`${toDuel1} ${projectileActions[projectileActionSlot]} ${item} aimed at ${duelEE1}(${attackerHP}hp)'s ${bodyParts[bodyHit]}, ${damageStatement}`)
                    .setColor(color)
                await message.channel.send({embed: embed});
                // await message.channel.send(
                //     "```html\n" + //`<${toDuel1} (${defenderHP}hp)>\n`+ 
                //     `<${toDuel1} (${defenderHP}hp)> ${projectileActions[projectileActionSlot]} ${item} aimed at <${duelEE1} (${attackerHP}hp)>'s ${bodyParts[bodyHit]}, ${damageStatement}`
                //      + "```"
                // );
                wait(1500);
                return attackerHP -= damage;

            }
            else if(scenario == 2){
                bodyActionSlot = randomInt(0,bodyActions.length -1);
                bodyHit = randomInt(0,bodyParts.length -1);
                damage = randomInt(9,23);
                await console.log(damage, attackerHP, defenderHP);
                var embed = await new Discord.RichEmbed()
                    .setTitle(`${toDuel1} (${defenderHP}hp)`)
                    .setDescription(`${toDuel1} ${bodyActions[bodyActionSlot]} ${duelEE1}(${attackerHP}hp)'s ${bodyParts[bodyHit]} dealing ${damage}`)
                    .setColor(color)
                await message.channel.send({embed: embed});
                // await message.channel.send(
                //     "```html\n" + //`<${toDuel1} (${defenderHP}hp)>\n`+ 
                //     `<${toDuel1} (${defenderHP}hp)> ${bodyActions[bodyActionSlot]} <${duelEE1} (${attackerHP}hp)>'s ${bodyParts[bodyHit]} dealing ${damage}`
                //      + "```"
                // );
                wait(1500);
                return attackerHP -= damage;
                
            }
            else if(scenario == 3){
                damage = randomInt(8,15);
                specificActionsSlot = randomInt(0,specificActions.length-1);
                if(specificActionsSlot == 0){
                    suicideChance = randomInt(0,99);
                    if(suicideChance == 69){
                        damage = 0
                        await console.log(damage, attackerHP, defenderHP);
                        var embed = await new Discord.RichEmbed()
                            .setTitle(`${toDuel1} (${defenderHP}hp)`)
                            .setDescription(`${toDuel1} (${defenderHP}hp) failed to convince ${duelEE1} (${attackerHP}hp) from suiciding`)
                            .setColor("#fd013e")
                        await message.channel.send({embed: embed});
                        // await message.channel.send(
                        //     "```html\n" + //`<${toDuel1} (${defenderHP}hp)>\n`+ 
                        //     `${toDuel1} (${defenderHP}hp) failed to convince ${duelEE1} (${attackerHP}hp) from suiciding`
                        //      + "```"
                        // );
                        wait(1500);
                        return attackerHP = 0;    
                    }
                }
                await console.log(damage, attackerHP, defenderHP);
                var embed = await new Discord.RichEmbed()
                    .setTitle(`${toDuel1} (${defenderHP}hp)`)
                    .setDescription(`${specificActions[specificActionsSlot]}, dealing ${damage}`)
                    .setColor(color)
                await message.channel.send({embed: embed});
                // await message.channel.send(
                //     "```html\n" + //`<${toDuel1} (${defenderHP}hp)>\n`+ 
                //     `${specificActions[specificActionsSlot]}, dealing ${damage}`
                //      + "```"
                // );
                wait(1500);
                return attackerHP -= damage;
            } 
    }
    //sending and accepting/declining duel
    let msg = await message.channel.send(`The user ${toDuel} has been challenged to a duel by ${message.author.tag}. React with :white_check_mark: or :negative_squared_cross_mark: within 10 seconds.`);
    await msg.react(accept);
    await msg.react(decline);

    var reactions = await msg.awaitReactions((reaction, user) => (reaction.emoji.name == accept || reaction.emoji.name == decline) && user.id == toDuel.user.id, {max : 1, time: 10000});

    console.log(`Reactions collected ${reactions.size }, ${reactions.get(accept)} ${reactions.get(decline)}`);
    if(reactions.get(accept) == undefined && reactions.get(decline) == undefined ){
        console.log("1");
        msg.clearReactions();
        return msg.edit("The duel request has expired.");
    }
    else if (reactions.get(accept) == undefined && reactions.get(decline) != undefined ){
        console.log("2");
        msg.clearReactions();
        return msg.edit(`${toDuel.user.tag} has declined the duel from ${message.author.tag}`);
    }
    else if(reactions.get(accept) != undefined && reactions.get(decline) == undefined){
        msg.clearReactions();
        msg.edit(`${toDuel.user.tag} has accepted the duel from ${message.author.tag}`);
        var turn = randomInt(0,1);

        var color0 = "#0099e1";
        var color1 = "#e74600";
        console.log(`turn = ${turn} healthZero = ${healthZero} healthOne = ${healthOne}`);
        var done = false;
    }

    while(done == false){
        while(done == false && turn === 0){
            healthOne = await play(duelEE.username, toDuel.user.username, healthOne, healthZero, color0);
            await win_check(duelEE.id, duelEE.tag, toDuel.id, toDuel.user.tag, healthZero, healthOne);
            turn = 1;
        }
        while(done == false && turn === 1){
            healthZero = await play(toDuel.user.username, duelEE.username, healthZero, healthOne, color1);
            await win_check(toDuel.id, toDuel.user.tag, duelEE.id, duelEE.tag, healthOne, healthZero);
            turn = 0;
        }
    }
    return;
}

module.exports.help = {
    name: "duel"
}
