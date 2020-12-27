module.exports = function embed(msg, title, color, description, footer = '') {
    const Discord = require('discord.js');

    const MessageEmbed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(description)
        .setFooter(footer)
        .setTimestamp();
  
    msg.channel.send(MessageEmbed);
};