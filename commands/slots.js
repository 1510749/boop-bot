const Discord = require('discord.js');
const fs = require("fs");

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

module.exports.run = async (bot, message, args) => {
    function play(){
        let spot = [1, 2, 3,
                    4, 5, 6,
                    7, 8, 9];
        for (i in spot){
            let slotpic = selection[randomInt(0,selection.length-1)]
            spot[i] = slotpic;
        }
        return spot
    }
    function win_check(spot3, multiplier1){
        let conditions = [[0,1,2], [3,4,5], [6,7,8], [0,4,8], [2,4,6]];
        let totalreward = 0;
        for (i in conditions){
            let x = conditions[i];
            let a = x[0]; let b = x[1]; let c = x[2];
            console.log(a, b, c);
            console.log(spot3[a], spot3[b], spot3[c]);
            if (spot3[a] == spot3[b] && spot3[b] == spot3[c]){
                console.log("won");
                returns =  Math.floor(multiplier1 * selectionpot[selection.indexOf(spot3[a])])
                totalreward += returns;
            }
            if(spot3[a] == "<:One:422318791737868288>" && spot3[b] == "<:Zero:401218557863526402>" && spot3[c] == "<:One:422318791737868288>" ){
                returns = Math.floor(multiplier1 * specialpot[0])
                totalreward += returns;
            }
        }
        console.log(`Reward = ${totalreward} Coins`);
        bot.inventory[gambler.id].Browncoins += totalreward;
        fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
            if(err) throw err;
        });
        return totalreward
    }
    const close = "❌";
    const ten = bot.emojis.find("name", "10");//"<:10:422454747245707266>"; test server ones
    const twentyfive = bot.emojis.find("name", "25");//" <:25:422454747233124362>";
    const fifty = bot.emojis.find("name", "50");//"<:50:422454747342176277>";
    const onehundred = bot.emojis.find("name", "1hun");//"<:1hun:422454747333787648>";
    const twohundredfifty = bot.emojis.find("name", "250");//"<:250:422454746989723692>";

    let gambler = message.author;
    let paylines = "";
    //<:One:401218558320967680> <:Zero:401218557863526402> <:Could:413213947748155402> Brown server Ones
    let selection = [":x:", "<:Zero:401218557863526402>", "<:One:422318791737868288>", ":hearts:", ":zap:", ":star:", ":a:", ":cherries:",":gem:", "<:Could:413213947748155402>"];
    let selectionpot = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    let specialpot = [150];

    if(args[0] == "lines"){
        for(i in selection){
            paylines += `\n${selection[i]}x3 = ${selectionpot[i]} Browncoins x Multiplier(1-5)`
        }
        paylines += "\n<:One:422318791737868288> <:Zero:401218557863526402> <:One:422318791737868288> = 150 Browncoins x Multiplier(1-5)"
        return message.channel.send("```md\n" + "# Pay Lines #\n*The more you bet, the higher your multiplier*\n```" + paylines)
    }

    //sending Slots
    let msg = await message.channel.send("```md\n" + `[${gambler.username}](${bot.inventory[gambler.id].Browncoins} rune zone)'s Slot Machine` +"\n```\n" + "Select a bet amount to play. Or ❌ to leave");

    var playing = true;
    while(playing){
        await msg.react(close);
        await msg.react(ten);
        await msg.react(twentyfive);
        await msg.react(fifty);
        await msg.react(onehundred);
        await msg.react(twohundredfifty);

        var reactions1 = await msg.awaitReactions((reaction, user) => (reaction.emoji.name == close || reaction.emoji.name == ten.name ||
            reaction.emoji.name == twentyfive.name || reaction.emoji.name == fifty.name || reaction.emoji.name == onehundred.name ||
            reaction.emoji.name == twohundredfifty.name) && user.id == gambler.id, {max : 1, time: 10000});
        
        if(reactions1.get(close) == undefined && reactions1.get(ten.id) == undefined && reactions1.get(twentyfive.id) == undefined 
        && reactions1.get(fifty.id) == undefined && reactions1.get(onehundred.id) == undefined && reactions1.get(twohundredfifty.id) == undefined){
            console.log("1");
            console.log(`${reactions1.get(close)}, ${reactions1.get(ten.id)}, ${reactions1.get(twentyfive.id)}, ${reactions1.get(fifty.id)}, ${reactions1.get(onehundred.id)}, ${reactions1.get(twohundredfifty.id)}`);
            msg.clearReactions();
            playing = false;
            return msg.edit(`${gambler.tag} has been kicked off the slots for falling asleep...`);
        }
        else if(reactions1.get(close) != undefined){
            console.log("2");
            console.log(`${reactions1.get(close)}, ${reactions1.get(ten.id)}, ${reactions1.get(twentyfive.id)}, ${reactions1.get(fifty.id)}, ${reactions1.get(onehundred.id)}, ${reactions1.get(twohundredfifty.id)}`);
            msg.clearReactions();
            playing = false;
            return msg.edit(`${gambler.tag} has left the machine...`)
        }
        else if(reactions1.get(ten.id) != undefined){
            console.log("3");
            console.log(`${reactions1.get(close)}, ${reactions1.get(ten.id)}, ${reactions1.get(twentyfive.id)}, ${reactions1.get(fifty.id)}, ${reactions1.get(onehundred.id)}, ${reactions1.get(twohundredfifty.id)}`);

            await msg.clearReactions();
            let bet = 10;
            if(bot.inventory[gambler.id].Browncoins < bet){
                msg.clearReactions();
                msg.delete();
                return message.channel.send("You were kicked off the slot machine because of insufficient Browncoins.");
            }
            bot.inventory[gambler.id].Browncoins -= bet;
            fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                if(err) throw err;
            });
            let multiplier = 1;
            let spot2 = await play();
            let board = `${spot2[0]} ${spot2[1]} ${spot2[2]}\n${spot2[3]} ${spot2[4]} ${spot2[5]}\n${spot2[6]} ${spot2[7]} ${spot2[8]}`;
            let reward = win_check(spot2, multiplier);
            let winmessage = `and won ${reward} Browncoins`;
            msg.edit("```md\n" + `[${gambler.username}](${bot.inventory[gambler.id].Browncoins} Browncoins)'s Slot Machine` +
            "\n```\n"+ `${board}\n\n${gambler.tag} has bet 10 Browncoins ` + winmessage);
        }
        else if(reactions1.get(twentyfive.id) != undefined){
            console.log("4");
            console.log(`${reactions1.get(close)}, ${reactions1.get(ten.id)}, ${reactions1.get(twentyfive.id)}, ${reactions1.get(fifty.id)}, ${reactions1.get(onehundred.id)}, ${reactions1.get(twohundredfifty.id)}`);

            await msg.clearReactions();
            let bet = 25;
            if(bot.inventory[gambler.id].Browncoins < bet){
                msg.clearReactions();
                msg.delete();
                return message.channel.send("You were kicked off the slot machine because of insufficient Browncoins.");
            }
            bot.inventory[gambler.id].Browncoins -= bet;
            fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                if(err) throw err;
            });
            let multiplier = 2;
            let spot2 = await play();
            let board = `${spot2[0]} ${spot2[1]} ${spot2[2]}\n${spot2[3]} ${spot2[4]} ${spot2[5]}\n${spot2[6]} ${spot2[7]} ${spot2[8]}`;
            let reward = win_check(spot2, multiplier);
            let winmessage = `and won ${reward} Browncoins`;
            msg.edit("```md\n" + `[${gambler.username}](${bot.inventory[gambler.id].Browncoins} Browncoins)'s Slot Machine` +
            "\n```\n" + `${board}\n\n${gambler.tag} has bet 25 Browncoins ` + winmessage);
        }
        else if(reactions1.get(fifty.id) != undefined){
            console.log("5");
            console.log(`${reactions1.get(close)}, ${reactions1.get(ten.id)}, ${reactions1.get(twentyfive.id)}, ${reactions1.get(fifty.id)}, ${reactions1.get(onehundred.id)}, ${reactions1.get(twohundredfifty.id)}`);

            await msg.clearReactions();
            let bet = 50;
            if(bot.inventory[gambler.id].Browncoins < bet){
                msg.clearReactions();
                msg.delete();
                return message.channel.send("You were kicked off the slot machine because of insufficient Browncoins.");
            }
            bot.inventory[gambler.id].Browncoins -= bet;
            fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                if(err) throw err;
            });
            let multiplier = 3;
            let spot2 = await play();
            let board = `${spot2[0]} ${spot2[1]} ${spot2[2]}\n${spot2[3]} ${spot2[4]} ${spot2[5]}\n${spot2[6]} ${spot2[7]} ${spot2[8]}`;
            let reward = win_check(spot2, multiplier);
            let winmessage = `and won ${reward} Browncoins`;
            msg.edit("```md\n" + `[${gambler.username}](${bot.inventory[gambler.id].Browncoins} Browncoins)'s Slot Machine` +
            "\n```\n" + `${board}\n\n${gambler.tag} has bet 50 Browncoins ` + winmessage);
        }
        else if(reactions1.get(onehundred.id) != undefined){
            console.log("6");
            console.log(`${reactions1.get(close)}, ${reactions1.get(ten.id)}, ${reactions1.get(twentyfive.id)}, ${reactions1.get(fifty.id)}, ${reactions1.get(onehundred.id)}, ${reactions1.get(twohundredfifty.id)}`);

            await msg.clearReactions();
            let bet = 100;
            if(bot.inventory[gambler.id].Browncoins < bet){
                msg.clearReactions();
                msg.delete();
                return message.channel.send("You were kicked off the slot machine because of insufficient Browncoins.");
            }
            bot.inventory[gambler.id].Browncoins -= bet;
            fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                if(err) throw err;
            });
            let multiplier = 4;
            let spot2 = await play();
            let board = `${spot2[0]} ${spot2[1]} ${spot2[2]}\n${spot2[3]} ${spot2[4]} ${spot2[5]}\n${spot2[6]} ${spot2[7]} ${spot2[8]}`;
            let reward = win_check(spot2, multiplier);
            let winmessage = `and won ${reward} Browncoins`;
            msg.edit("```md\n" + `[${gambler.username}](${bot.inventory[gambler.id].Browncoins} Browncoins)'s Slot Machine` +
            "\n```\n" + `${board}\n\n${gambler.tag} has bet 100 Browncoins ` + winmessage);
        }
        else if(reactions1.get(twohundredfifty.id) != undefined){
            console.log("7");
            console.log(`${reactions1.get(close)}, ${reactions1.get(ten.id)}, ${reactions1.get(twentyfive.id)}, ${reactions1.get(fifty.id)}, ${reactions1.get(onehundred.id)}, ${reactions1.get(twohundredfifty.id)}`);

            await msg.clearReactions();
            let bet = 250;
            if(bot.inventory[gambler.id].Browncoins < bet){
                msg.clearReactions();
                msg.delete();
                return message.channel.send("You were kicked off the slot machine because of insufficient Browncoins.");
            }
            bot.inventory[gambler.id].Browncoins -= bet;
            fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                if(err) throw err;
            });
            let multiplier = 5;
            let spot2 = await play();
            let board = `${spot2[0]} ${spot2[1]} ${spot2[2]}\n${spot2[3]} ${spot2[4]} ${spot2[5]}\n${spot2[6]} ${spot2[7]} ${spot2[8]}`;
            let reward = win_check(spot2, multiplier);
            let winmessage = `and won ${reward} Browncoins`;
            msg.edit("```md\n" + `[${gambler.username}](${bot.inventory[gambler.id].Browncoins} Browncoins)'s Slot Machine` +
            "\n```\n" + `${board}\n\n${gambler.tag} has bet 250 Browncoins ` + winmessage);
        }
    }
}

/*
function PlaySlots(ReactAmount, ConsoleCase, BetAmount, MultiplierNum) {
    if(reactions1.get(ReactAmount) != undefined){
        console.log(ConsoleCase);
        console.log(`${reactions1.get(close)}, ${reactions1.get(ten.id)}, ${reactions1.get(twentyfive.id)}, ${reactions1.get(fifty.id)}, ${reactions1.get(onehundred.id)}, ${reactions1.get(twohundredfifty.id)}`);

        await msg.clearReactions();
        let bet = BetAmount;
        if(bot.inventory[gambler.id].Browncoins < bet){
            msg.clearReactions();
            msg.delete();
            return message.channel.send("You were kicked off the slot machine because of insufficient Browncoins.");
        }
        bot.inventory[gambler.id].Browncoins -= bet;
        fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
            if(err) throw err;
        });
        let multiplier = MultiplierNum;
        let spot2 = await play();
        let board = `${spot2[0]} ${spot2[1]} ${spot2[2]}\n${spot2[3]} ${spot2[4]} ${spot2[5]}\n${spot2[6]} ${spot2[7]} ${spot2[8]}`;
        let reward = win_check(spot2, multiplier);
        let winmessage = `and won ${reward} Browncoins`;
        msg.edit("```md\n" + `[${gambler.username}](${bot.inventory[gambler.id].Browncoins} Browncoins)'s Slot Machine` +
        "\n```\n" + `${board}\n\n${gambler.tag} has bet 250 Browncoins ` + winmessage);
    }
}
*/


module.exports.help = {
    name: "slots"
}
