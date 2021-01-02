/**
 * Instanciation des dépendances discord et création du client discord
 */
const Discord = require('discord.js');
const client = new Discord.Client();

/**
 * Fichier stockant les informations variables du BOT
 */
const config = require('./config');

/**
 * Authentification du BOT grâce au token DISCORD
 */
client.login(config.discordtoken);

/**
 * Instanciation des données nécéssaires à l'utilisation de SQLITE3 et de sa DB
 */
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');

/**
 * Fonction permettant d'envoyer des "embed" => forme de blocs markdown sur discord
 */
const embed = require('./embed');

/**
 * Instanciation de toutes les commandes déportées sous formes de fonctions pour simplifier le fichier
 */
const call = require('./commands/call');
const usercmd = require('./commands/user');
const secret = require('./commands/secret');
const help = require('./commands/help');

/**
 * Création des constantes permettant le fonctionnement du bot
 */
const prefix = config.discordprefix;
const ADMIN = 0;
const USER = 1;

/**
 * Dès que le bot est "ready" (prêt), l'annoncer en console et mettre comme status !help
 */
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`${prefix}help`); 
});

/**
 * Lorsqu'un message est reçu, lancer le code contenu dans la fonction
 */
client.on("message", function(message) {
    /**
     * Si l'auteur du message est un bot, finir la fonction
     */
    if (message.author.bot) return;

    /**
     * Si le message ne commence pas par le préfix défini, alors ce n'est pas une commande et finir la fonction
     */
    if (!message.content.startsWith(prefix)) return;

    /**
     * Instanciation de toutes les variables permettant l'utilisation du bot et des informations fournies
     */
    const commandBody = message.content.slice(prefix.length).toLowerCase();
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    const user = "@" + message.author.username + '#' + message.author.discriminator;
    const all = { commandBody, args, command, message, user };

    /**
     * Vérification des permissions de l'utilisateur lors de la commande
     */
    db.get('SELECT permissions FROM users WHERE userid = ?', [message.author.id], (err, row) => {
      if (err) console.log(err.message);

      /**
       * Système stockant les commandes authorisées selon le grade
       */
      const ADMIN_CMD = ['user', 'calltest'];
      const USER_CMD = ['call', 'secret', 'help'];

      /**
       * Vérification de si la est admin où utilisateur, si non alors elle n'existe pas et retourne une erreur
       */
      if(!ADMIN_CMD.includes(command) && !USER_CMD.includes(command)) {
        embed(message, 'Bad command', 15158332, "This command doesn't exist. Please ask help to an admin.", user)
      }

      /**
       * Si l'utilisateur n'est pas déjà dans la db, alors il n'a pas de permissions et les set à null
       */
      if(row != undefined)  perms = row.permissions;
      else perms = null;

      /**
       * Si l'utilisateur rentre une commande admin mais n'a pas les droits, alors un message disant qu'il n'as pas les droits est envoyé
       * Si il est admin et lance une commande Admin, alors l'éxécuter
       */
      if(perms != ADMIN && ADMIN_CMD.includes(command)) {
          embed(message, 'Permissions', 15158332, "You don't have the permissions to use this command. Please ask help to an admin.", user);
      } else if(perms == ADMIN && ADMIN_CMD.includes(command)) {
          usercmd(all);
          call(all);
      }

      /**
       * Si l'utilisateur n'a pas les droits utilisateur ni admin, et lance une commande utilisateur (sauf secret et help qui sont des exceptions)
       * Alors lui dire qu'il n'as pas les droits/
       * 
       * Si c'est un USER / ADMIN et qu'il fait bien une fonction stockée, la lancer.
       * Si il n'est ni user ni admin mais que la commande est secret ou help, alors quand même autoriser la commande :
       * help permet d'aider n'importe qui, et secret est une fonction de sécuritée permettant de mettre admin n'importe qui grâce à un mot de passe de récupération
       */
      if(perms != USER && USER_CMD.includes(command) && perms != ADMIN && command != 'secret' && command != 'help') {
          embed(message, 'Permissions', 15158332, "You don't have the permissions to use this command. Please ask help to an admin.", user);
      } else if(perms == USER || perms == ADMIN && USER_CMD.includes(command)) {
          call(all);
          secret(all);
          help(all);
      } else {
        secret(all);
        help(all);
      }
    });
});
