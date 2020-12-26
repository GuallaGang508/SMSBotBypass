const Discord = require('discord.js');
const client = new Discord.Client();
const call = require('./commands/call');
const prefix = "!";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    const all = { commandBody, args, command, message };

    console.log(message);

    call(all);
  });

client.login('NzkyMTIxNDg1MzIxNjk5MzQ4.X-ZGnw.HCzXLQI5QDcOUd3btWPwywcmyrQ');