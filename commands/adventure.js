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
module.exports.run = async (bot, message, args) => {
    let adventurer = message.author;
    var foods = ["Cookies", "Donuts", "Pringles", "Coke", "Pepsi", "CannedBeans", "Hamburgers", "Pizzas", "Pies", "Brownies"];
    let finds = randomInt(1,100);
    var possibleitems = [];
    for(let i in bot.inventory[message.author.id]){
        if(i != "guild" && i != "name" && i != "weapon" && i != "neck"){
            possibleitems.push(i)
        }
    }
    for(let i in foods){
        possibleitems.push(foods[i])
    }
    console.log(possibleitems, finds);
    console.log(bot.adventureCD);
    var necks =["Choker", "RubyPendant", "OpalNecklace", "Belt", "GoldPendant", "DiamondNecklace",
    "BrownPendant", "EthernetNecklace", "WettPendant", "Noose"];
    var neckHealth = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    var neckHP = 0;
    for(let i in necks){
        if(necks[i] == bot.inventory[adventurer.id].neck){
            neckHP = neckHealth[i];
        }
    }

    if(!bot.levelD[adventurer.id].bossesdefeated){
        bot.levelD[adventurer.id].bossesdefeated = 0
        fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
            if(err) throw err;
            console.log(`${adventurer.tag}'s profile has been updated.`);
        });
    }
    if(args[0] == "profile"){
        let embed = new Discord.RichEmbed()
        .setAuthor(`${adventurer.tag}'s Adventure Profile`)
        .setColor("#4b02db")
        .setThumbnail(adventurer.displayAvatarURL)
        .setTitle(`Level: ${bot.levelD[adventurer.id].level}`)
        .setDescription(`**Total Exp** : ${bot.levelD[adventurer.id].exp}` +
        `\n**Exp to next level** : ${ (Math.floor(Math.pow((((bot.levelD[adventurer.id].level+1) - 1)/.2),2))) - (bot.levelD[adventurer.id].exp)}` +
        `\n**Bosses defeated** : ${bot.levelD[adventurer.id].bossesdefeated}`+
        `\n**Creatures defeated** : ${bot.levelD[adventurer.id].creaturesdefeated}` +
        `\n\n**Weapon Equipped:** : ${bot.inventory[adventurer.id].weapon}` +
        `\n**Neck Equipped:** : ${bot.inventory[adventurer.id].neck}`)
        return message.channel.send({embed:embed});
    }

    if(!bot.inventory[adventurer.id]){
        return message.channel.send("You may not adventure yet");
    }
    else if(bot.adventureCD[adventurer.id]){
        return message.channel.send(`You may not adventure yet : t- ${(bot.adventureCD[adventurer.id].time - Date.now())/60000} minutes`);
    }

    var possiblemonsters = ["Snail", "Brown Snail", "Slime", "Gold Fish", "Bush", "Tree", "Stump", "Bear",
        "Crab", "Penguin", "Boar", "Brown Hobo", "Ogre", "Cockatrice", "Unicorn", "Phoenix", "Griffin",
        "Chimera", "Wyvern", "Dragon"];

    var monster = possiblemonsters[randomInt(0,possiblemonsters.length-1)];
    var monsterlevel = bot.levelD[adventurer.id].level + randomInt(-5, 5);
    if(monsterlevel <= 0){
        monsterlevel = 1;
    }
    var monsterHP = monsterlevel * 10;
    var expgained = randomInt(0,15) + Math.floor(bot.levelD[adventurer.id].level *.5) + monsterlevel;

    var adventurerHP = (bot.levelD[adventurer.id].level * 10) + neckHP;

    console.log(monster, monsterlevel, monsterHP, bot.levelD[adventurer.id].level, adventurerHP, bot.inventory[adventurer.id].weapon, bot.inventory[adventurer.id].neck);

    function win_check(attacker, attackerlevel, attackerHP, defender, defenderlevel, defenderHP){
        if(defenderHP <= 0 ){
            done = true;
            if(bot.levelD[attacker] && bot.inventory[attacker]){
                bot.levelD[attacker].creaturesdefeated += 1
                bot.levelD[attacker].exp += expgained;
                bot.levelD[attacker].level = Math.floor(0.2 * Math.sqrt(bot.levelD[attacker].exp)) + 1;

                fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
                    if(err) throw err; 
                    console.log(`Data saved.`);
                });

                if(finds <= 3){
                    let itemfound = possibleitems[randomInt(0,possibleitems.length-1)];
                    if(bot.inventory[attacker][itemfound]){
                        bot.inventory[attacker][itemfound] += 1;
                    }
                    else{
                        bot.inventory[attacker][itemfound] = 1;
                    }

                    fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                        if(err) throw err;
                        message.channel.send("```md\n" + "# Adventure Complete #\n" +
                        `Lv${bot.levelD[attacker].level} [${bot.inventory[attacker].name}](${attackerHP}hp) has defeated a Lv${defenderlevel} ${defender}.` +
                        `\n${bot.inventory[attacker].name} gained ${expgained} Exp and 1 ${itemfound}`+ "\n```");
                        console.log(`${bot.inventory[attacker].name} has found 1 ${itemfound}`);
                        });
                }
                else{
                    let coinswon = randomInt(0,Math.floor(20 + monsterlevel * .5)) + monsterlevel;

                    bot.inventory[attacker].Browncoins += coinswon;
                    console.log(`${bot.inventory[attacker].name} has gained ${expgained} Exp and won ${coinswon} currency from adventuring.`);

                    fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                        if(err) throw err; 
                        message.channel.send("```md\n" + "# Adventure Complete #\n" +
                        `Lv${bot.levelD[attacker].level} [${bot.inventory[attacker].name}](${attackerHP}hp) has defeated a Lv${defenderlevel} ${defender}.` +
                        `\n${bot.inventory[attacker].name} gained ${expgained} Exp and ${coinswon} Browncoins`+ "\n```");
                        console.log(`Currency saved.`);
                    });
                }
            }
            else{
                if(attackerHP <= Math.floor((attackerlevel*10)*.35)){
                    bot.levelD[defender].exp += Math.floor(expgained/2);
                    bot.levelD[defender].level = Math.floor(0.2 * Math.sqrt(bot.levelD[defender].exp)) + 1;

                    fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
                        if(err) throw err; 
                        console.log(`Data saved.`);
                    });
                    let coinslost = randomInt(0,10) + Math.floor(monsterlevel/2);
                    if(bot.inventory[defender].Browncoins - coinslost < 0){
                        coinslost = bot.inventory[defender].Browncoins;
                    }
                    bot.inventory[defender].Browncoins -= coinslost;
                    console.log(`${bot.inventory[defender].name} has gained ${Math.floor(expgained/2)} Exp and lost ${coinslost} currency from adventuring.`);

                    fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                        if(err) throw err; 
                        message.channel.send("```md\n" + "# Adventure Complete #\n" +
                        `Lv${attackerlevel} [${attacker}](${attackerHP}hp) defeated Lv${defenderlevel} ${bot.inventory[defender].name}` +
                        `\n${bot.inventory[defender].name} gained ${Math.floor(expgained/2)} Exp and lost ${coinslost} Browncoins`+ "\n```");
                        console.log(`Currency saved.`);
                    });
                }
                else{
                    bot.levelD[defender].exp += Math.floor(expgained/3);
                    bot.levelD[defender].level = Math.floor(0.2 * Math.sqrt(bot.levelD[defender].exp)) + 1;

                    fs.writeFile("./levelD.json", JSON.stringify(bot.levelD, null, 4), err => {
                        if(err) throw err; 
                        console.log(`Data saved.`);
                    });
                    let coinslost = randomInt(0,10) + monsterlevel;
                    if(bot.inventory[defender].Browncoins - coinslost < 0){
                        coinslost = bot.inventory[defender].Browncoins;
                    }
                    bot.inventory[defender].Browncoins -= coinslost;
                    console.log(`${bot.inventory[defender].name} has gained ${Math.floor(expgained/3)} Exp and lost ${coinslost} currency from adventuring.`);

                    fs.writeFile("./inventory.json", JSON.stringify(bot.inventory, null, 4), err => {
                        if(err) throw err; 
                        message.channel.send("```md\n" + "# Adventure Complete #\n" +
                        `Lv${attackerlevel} [${attacker}](${attackerHP}hp) < REKT > Lv${defenderlevel} ${bot.inventory[defender].name}` +
                        `\n${bot.inventory[defender].name} gained ${Math.floor(expgained/3)} Exp and lost ${coinslost} Browncoins`+ "\n```");
                        console.log(`Currency saved.`);
                    });

                }
            }
        }
        
    }
    async function play(attacker, attackerlevel, attackerHP, defender, defenderlevel, defenderHP){
        var weapons = ["Stick", "WoodenSword", "RatFlail", "Knife", "MetalPipe", "Rapier", "LongBow", "MetalFlail",
        "PyriteScythe", "SpellBook", "Sai", "LongSword", "RubberWand", "Whip", "Lance",
        "Crossbow","Halberd", "Katar", "QuartzStaff", "Chakram", "Katana", "SteelAxe", "Flamethrower",
        "DiamondDagger", "GoldenSword", "AmethystScepter", "MiniatureCannon", "GoldenSai", "Pistol",
        "MetalPlayingCards", "SniperRifle", "AncientStick", "GoldenGun", "Lightsaber", "KNOWLEDGE"];
        var weapondamage = [1, 2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54,
            57, 60, 64, 67, 71, 74, 78, 81, 85, 88, 92, 95, 99, 102];

        if(bot.levelD[attacker] && bot.inventory[attacker]){
            //if i want Logs
            // await message.channel.send(
            //     "```html\n" + `Lv${attackerlevel} <${attacker.username} (${attackerHP}hp)>\n`+ 
            //     `Dealt ${attackerdamage} damage to the Lv${defenderlevel} <${defender} (${defenderrHP}hp)>.`
            //     + "```"
            // );
            var adventurerwepdmg = 0;
            if(bot.inventory[attacker].weapon == "" ){
                adventurerwepdmg = 0;
            }
            else{
                for(let i in weapons){
                    if(weapons[i] == bot.inventory[attacker].weapon){
                        adventurerwepdmg = weapondamage[i];
                    }
                }
            }
            var attackerdamage = Math.floor(((5 + Math.sqrt(bot.levelD[attacker].level)*2) + adventurerwepdmg + randomInt(-5,10)));
            if(attackerdamage <= 0){
                attackerdamage = Math.floor(((randomInt(1,5) + Math.sqrt(bot.levelD[attacker].level)*2) + adventurerwepdmg)/2);
            }
            console.log(`turn = ${turn} attacker = ${bot.inventory[attacker].name} attackerHP = ${attackerHP} damage = ${attackerdamage} defender = ${defender} defenderHP = ${defenderHP}`);
        }
        else{
            // await message.channel.send(
            //     "```html\n" + `Lv${attackerlevel} <${attacker} (${attackerHP}hp)>\n`+ 
            //     `Dealt ${attackerdamage} damage to the Lv${defenderlevel} <${defender} (${defenderrHP}hp)>.`
            //     + "```"
            // );
            var attackerdamage = monsterlevel + randomInt(-2,10);
            if(attackerdamage <= 0){
                attackerdamage = Math.floor(monsterlevel/2);
            }
            console.log(`turn = ${turn} attacker = ${attacker} attackerHP = ${attackerHP} damage = ${attackerdamage} defender = ${bot.inventory[defender].name} defenderHP = ${defenderHP}`);

        }
        //wait(1500);
        return defenderHP -= attackerdamage;
    }

    var turn = randomInt(0,1);
    console.log(`turn = ${turn} adventurerHP = ${adventurerHP} monsterHP = ${monsterHP}`);
    var done = false;

    while(done == false){
        while(done == false && turn === 0){
            // var adventurerdamage = Math.floor(10 + Math.sqrt(bot.levelD[adventurer.id].level)*2) + adventurerwepdmg + randomInt(-10,15);
            // if(adventurerdamage <= 0){
            //     adventurerdamage = (Math.floor(10 + Math.sqrt(bot.levelD[adventurer.id].level)*2) + adventurerwepdmg)/2;
            // }
            monsterHP = await play(adventurer.id, bot.levelD[adventurer.id].level, adventurerHP, monster, monsterlevel, monsterHP);
            await win_check(adventurer.id, bot.levelD[adventurer.id].level, adventurerHP, monster, monsterlevel, monsterHP);
            turn = 1;
        }
        while(done == false && turn === 1){
            // var monsterdamage = monsterlevel + randomInt(-5,10);
            // if(monsterdamage <= 0){
            //     monsterdamage = monsterlevel/2;
            // }
            adventurerHP = await play(monster, monsterlevel, monsterHP, adventurer.id, bot.levelD[adventurer.id].level, adventurerHP);
            await win_check(monster, monsterlevel, monsterHP, adventurer.id, bot.levelD[adventurer.id].level, adventurerHP);
            turn = 0;
        }
    }

    var cooldown = 10000//Date.now() + 7200000 - Math.pow((.3794733192*(bot.levelD[adventurer.id].level)),2) *10000;
    // if(cooldown <= 3600000){
    //     cooldown = 3600000;
    // }
    bot.adventureCD[adventurer.id] = {
        guild: message.guild.id,
        time: cooldown
    }
    fs.writeFile("./adventureCD.json", JSON.stringify(bot.adventureCD, null, 4), err => {
            if(err) throw err;
            return console.log(`${adventurer.tag} went on an adventure`);
    });
}

module.exports.help = {
    name: "adventure"
}