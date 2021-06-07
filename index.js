const fetch = require("node-fetch");

const Discord = require("discord.js");

const client = new Discord.Client();

const webhook = new Discord.WebhookClient(

  process.env.WEBHOOKID,

  process.env.SECRET

);
//Initialize express
const express = require("express");

const bodyParser = require("body-parser");

async function f(id) {

  const response = await fetch(`https://discord.com/api/v9/users/${id}`, {

    headers: {

      Authorization: `Bot ${process.env.TOKEN}`, //put your Bot's token in enviornment variables and keep them safe.

    },

  });

  return await response.json();//returns reponse Status : 403 = Unauthorised

}
//Initialize app
const app = express();

const PORT = 4000;

app.get("/" , (req,res)=>{

  res.send("ok")

})

app.use(bodyParser.json());

app.post("/voted", async (req, res) => {

  console.log(req.body);
//your botlist bot token
  if (req.header("Authorization") != process.env.DISCORDBOTLIST) {

    return res.status("401").end(); 

  }
//The following 9 lines are to fetch avatar of the voter.
   const usera = await f(req.body.id);

   function getAvatarURL(usera, avatar, options) {

   if (!avatar) return null;

   options.format = options.format || "webp";

   if (options.dynamic)

   options.format = avatar.startsWith("a_") ? "gif" : options.format;

   return `https://cdn.discordapp.com/avatars/${usera}/${avatar}.${options.format}${options.size ? `?size=${options.size}` : ""}`;

  }

  let avatar = getAvatarURL(usera.id , usera.avatar,{ dynamic: true    });

 //Create an embed

  const embed = new Discord.MessageEmbed()

    .setAuthor("Thanks for voting !", avatar)

    .setDescription(`» ${usera.username}#${usera.discriminator} has voted for <bot-name> on [DISCORD BOT LIST](https://discordbotlist.com)! \n» You can vote again after : **12 hours**. \n» Voting link : [Click here](https://discordbotlist.com/bots/<bot-name>/upvote) \n» You have got the <@&role-id> role! `)

    .setColor("#738ADB")

    .setTimestamp()

    .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKOZTeY8UhXGZcjfXmZTZjCSpniGx-wj-EjSzUeqlQiXMCrolhKi3THhU&s=10");

  try {
//I am rewarding users with a role ,you can do something different also
     await rolemanager("SERVER_ID" , req.body.id ,"ROLE_ID" , "PUT" );

  

  await webhook.send(embed);

  } catch (e) {

    console.log(e);

  }

  console.log(

    `${req.body.id} ${usera.username} has voted for Izumi#9987 on discordbotlist.com`

  );

  res.status(200).end();

});

app.listen(PORT, () => console.log(`🚀 | Server running on port ${PORT} !`));

const rolemanager = async(guild,user , role , action )=>{

  await fetch(`https://discord.com/api/v9/guilds/${guild}/members/${user}/roles/${role}` ,{

  method : action,

  headers : {

  Authorization : `Bot ${process.env.TOKEN}`

 }

})

}

