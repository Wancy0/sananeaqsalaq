require("express")().listen(1343);
const ayarlar = require("./ayarlar.json")
const db = require("quick.db");
const discord = require("discord.js");
const client = new discord.Client({ disableEveryone: true });
const fetch = require("node-fetch");
const fs = require('fs')
const express = require('express');
const app = express();
const http = require('http');
    app.get("/", (request, response) => {
    console.log(` Bot Pinglenmedi`);
    response.sendStatus(200);
    });
    app.listen(process.env.PORT);
    setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);
let prefix = ayarlar.prefix
let token = ayarlar.token
let durum = ayarlar.durum

client.on("ready", async () => {
  client.user.setPresence({ activity: { name: durum }, status: "idle" })
  })

client.login(token)



setInterval(() => {
  var links = db.get("linkler");
  if(!links) return;
  var linkA = links.map(c => c.url)
  linkA.forEach(link => {
    try {
      fetch(link)
    } catch(e) { console.log("" + e) };
  })
  console.log("Pong! Requests sent")
}, 60000)

client.on("ready", () => {
if(!Array.isArray(db.get("linkler"))) {
db.set("linkler", [])
}
})

client.on("message", message => {
  if(message.author.bot) return;
  var spl = message.content.split(" ");
  if(spl[0] == `${prefix}ekle`) {
  var link = spl[1]
  fetch(link).then(() => {
    if(db.get("linkler").map(z => z.url).includes(link)) return message.channel.send(new discord.MessageEmbed().setCıkır('RED').setDescription("Botunuz Sistemimizde Zaten Var"))
    message.channel.send(new discord.MessageEmbed().setColor('GREEN').setDescription("Botunuz Sistemimize Başarıyla Eklendi."));
    db.push("linkler", { url: link, owner: message.author.id})
  }).catch(e => {
    return message.channel.send(new discord.MessageEmbed().setColor('RED').setDescription("Lütfen Bir Link Giriniz "))})
  }
})


client.on("message", message => {
  if(message.author.bot) return;
  var spl = message.content.split(" ");
  if(spl[0] == `${prefix}linkler`) {
  var link = spl[1]
 message.channel.send(new discord.MessageEmbed().setColor('BLUE').setDescription(`${db.get("linkler").length} Bot / ${client.guilds.size} Sunucu`))
}})


client.on("message", async message => {

  if(!message.content.startsWith("!eval")) return;
  if(!["0","1"].includes(message.author.id)) return;
  var args = message.content.split("!eval")[1]
  if(!args) return message.channel.send(new discord.MessageEmbed().setColor('RED').setDescription("Bir Kod Belirtmelisin!"))
  
      const code = args
    
    
      function clean(text) {
          if (typeof text !== 'string')
              text = require('util').inspect(text, { depth: 3 })
          text = text
              .replace(/`/g, '`' + String.fromCharCode(8203))
              .replace(/@/g, '@' + String.fromCharCode(8203))
          return text;
      };
  
      var evalEmbed = ""
      try {
          var evaled = await clean(await eval(await code));
          if (evaled.constructor.name === 'Promise') evalEmbed = `\`\`\`\n${evaled}\n\`\`\``
          else evalEmbed = `\`\`\`js\n${evaled}\n\`\`\``
          
  if(evaled.length < 1900) { 
     message.channel.send(`\`\`\`js\n${evaled}\`\`\``);
  } else {
    var hast = await require("hastebin-gen")(evaled, { url: "https://hasteb.in" } )
  message.channel.send(hast)
  }
      } catch (err) {
          message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
      }
  })
  //-----------------Etiket Prefix-----------------\\



client.on('message', async msg => {
  let prefix = ayarlar.prefix
  let botid = ayarlar.botid
  await db.fetch(`prefix.${msg.guild.id}`) 
  if(msg.content == `<@!${botid}>`) return msg.channel.send(`> **Prefixim**\n\n>  **Sanırım beni etiketlediniz.**\n >  prefix(ön ek)im \`${prefix}\``);
});
