module.exports = function embed(msg, title, color, description, footer = '') {
    /**
     * Instanciation de la dépendence discord.js pour créer le message embed
     */
    const Discord = require('discord.js');

    /**
     * Création du embed
     */
    const MessageEmbed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(description)
        .setFooter(footer)
        .setTimestamp();
  
    msg.channel.send(MessageEmbed);
};