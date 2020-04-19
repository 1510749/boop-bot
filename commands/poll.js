
module.exports.run = async (bot, message, args) => {
    let timer = args[1]*60000;
    if (isNaN(timer)){
        return message.channel.send("Invalid time parameter.");
    }

    if(args[0] == "cc"){
        var agree = "✅";
        var disagree = "❎";
    }
    else if(args[0] == "ud"){
        var agree = "👍";
        var disagree = "👎";
    }
    else if(args[0] == "mc"){
        //"1️⃣", "2️⃣", "3️⃣", "4️⃣"
        //const options = [":one:", ":two:", ":three:", ":four:"];
        //var options = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];
        // var optionOne = "1️⃣";
        // var optionTwo = "2️⃣";
        // var optionThree = "3️⃣";
        // var optionFour = "4️⃣";
        
        var optionOne = "🇦";
        var optionTwo = "🇧";
        var optionThree = "🇨";
        var optionFour = "🇩";
    }
   
    if(args[0] == "mc"){
        var questionInput = message.content.split(" ");
        delete questionInput.splice(0,3);
        var lastInput = questionInput.pop();
        var question = questionInput.join(" ");
        var answer = lastInput.split("/");
        console.log(lastInput, answer, answer.length, optionOne, optionTwo, optionThree, optionFour)
        if(answer.length == 1){
            var msg = await message.channel.send("```asciidoc\n[ Poll ]" + `\n${question}\n${optionOne} : ${answer[0]}` + "\n```");
            await msg.react(optionOne);
        }
        else if(answer.length == 2){
            var msg = await message.channel.send("```asciidoc\n[ Poll ]" + `\n${question}\n${optionOne} : ${answer[0]}\n${optionTwo} : ${answer[1]}` + "\n```");
            await msg.react(optionOne);
            await msg.react(optionTwo);
        }
        else if(answer.length == 3){
            var msg = await message.channel.send("```asciidoc\n[ Poll ]" + `\n${question}\n${optionOne} : ${answer[0]}\n${optionTwo} : ${answer[1]}\n${optionThree} : ${answer[2]}` + "\n```");
            await msg.react(optionOne);
            await msg.react(optionTwo);
            await msg.react(optionThree);            
        }
        else if(answer.length == 4){
            var msg = await message.channel.send("```asciidoc\n[ Poll ]" + `\n${question}\n${optionOne} : ${answer[0]}\n${optionTwo} : ${answer[1]}\n${optionThree} : ${answer[2]}\n${optionFour} : ${answer[3]}` + "\n```");
            await msg.react(optionOne);
            await msg.react(optionTwo);
            await msg.react(optionThree);   
            await msg.react(optionFour);
        }
    }
    else {
        var questionInput = message.content.split(" ");
        delete questionInput.splice(0,3);
        var question = questionInput.join(" ");
        var msg = await message.channel.send("```asciidoc\n[ Poll ]" + `\n${question}`+ "\n```");
        await msg.react(agree);
        await msg.react(disagree);        
    }

    var reactions = await msg.awaitReactions((reaction, user) => (reaction.emoji.name == agree || reaction.emoji.name == disagree ||
        reaction.emoji.name == optionOne || reaction.emoji.name == optionTwo || reaction.emoji.name == optionThree ||
        reaction.emoji.name == optionFour) , {max: 7, time: timer});

    if(args[0] == "mc"){
        if(answer.length == 1){
            if(reactions.get(optionTwo) == undefined){
                resultOne = 0;
            }
            else{result = reactions.get(optionOne).count-1;}
            msg.clearReactions();
            msg.edit("```diff\n- Poll Expired -\n```");
            return message.channel.send("\n```asciidoc\n= Poll Results =" + `\n${question}` +
                `\n${optionOne} : ${answer[0]}     [${resultOne} Votes]` + "\n```");
        }
        else if(answer.length == 2){
            if(reactions.get(optionOne) == undefined){
                resultOne = 0;
            }else{resultOne = reactions.get(optionOne).count-1;}

            if(reactions.get(optionTwo) == undefined){
                resultTwo = 0;
            }else{resultTwo = reactions.get(optionTwo).count-1;}

            msg.clearReactions();
            msg.edit("```diff\n- Poll Expired -\n```");
            return message.channel.send("\n```asciidoc\n= Poll Results =" + `\n${question}` +
                `\n${optionOne} : ${answer[0]}     [${resultOne} Votes]` +
                `\n${optionTwo} : ${answer[1]}     [${resultTwo} Votes]` + "\n```");
        }
        else if(answer.length == 3){
            if(reactions.get(optionOne) == undefined){
                resultOne = 0;
            }else{resultOne = reactions.get(optionOne).count-1;}

            if(reactions.get(optionTwo) == undefined){
                resultTwo = 0;
            }else{resultTwo = reactions.get(optionTwo).count-1;}

            if(reactions.get(optionThree) == undefined){
                resultThree = 0;
            }else{resultThree = reactions.get(optionThree).count-1;}

            msg.clearReactions();
            msg.edit("```diff\n- Poll Expired -\n```");
            return message.channel.send("\n```asciidoc\n= Poll Results =" + `\n${question}` +
                `\n${optionOne} : ${answer[0]}     [${resultOne} Votes]` +
                `\n${optionTwo} : ${answer[1]}     [${resultTwo} Votes]` +
                `\n${optionThree} : ${answer[2]}     [${resultThree} Votes]` + "\n```");
        }
        else if(answer.length == 4){
            if(reactions.get(optionOne) == undefined){
                resultOne = 0;
            }else{resultOne = reactions.get(optionOne).count-1;}

            if(reactions.get(optionTwo) == undefined){
                resultTwo = 0;
            }else{resultTwo = reactions.get(optionTwo).count-1;}

            if(reactions.get(optionThree) == undefined){
                resultThree = 0;
            }else{resultThree = reactions.get(optionThree).count-1;}

            if(reactions.get(optionFour) == undefined){
                resultFour = 0;
            }else{resultFour = reactions.get(optionFour).count-1;}

            msg.clearReactions();
            msg.edit("```diff\n- Poll Expired -\n```");
            return message.channel.send("\n```asciidoc\n= Poll Results =" + `\n${question}` +
                `\n${optionOne} : ${answer[0]}     [${resultOne} Votes]` +
                `\n${optionTwo} : ${answer[1]}     [${resultTwo} Votes]` +
                `\n${optionThree} : ${answer[2]}     [${resultThree} Votes]` +
                `\n${optionFour} : ${answer[3]}     [${resultFour} Votes]` + "\n```");
        }
    }
    else{
        if (reactions.get(agree) == undefined && reactions.get(disagree).count-1 == 0){
            msg.clearReactions();
            return msg.edit("```diff\n- Poll expired -" + `\n${question}` + "\n- No votes were casted -```");
        }
        else if(reactions.get(agree) == undefined && reactions.get(disagree).count-1 == 1){
            msg.clearReactions();
            msg.edit("```diff\n- Poll Expired -\n```");
            return message.channel.send("\n```asciidoc\n= Poll Results =" + `\n${question}\n\n${agree}: 0\n\n${disagree}: ${reactions.get(disagree).count-1}` + "\n```");
        }
        console.log(reactions.get(agree).count-1, reactions.get(disagree).count-1);
        msg.clearReactions();
        msg.edit("```diff\n- Poll Expired -\n```");
        return message.channel.send("```asciidoc\n= Poll Results =" + `\n${question}\n\n${agree}: ${reactions.get(agree).count-1}\n\n${disagree}: ${reactions.get(disagree).count-1}` + "\n```");
        
    }
}

module.exports.help = {
    name: "poll"
}
