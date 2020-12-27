module.exports = function(m) {
    /**
     * Instanciation des dépendences permettant l'utilisation de SQLITE3
     */
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    /**
     * Fonction permettant l'utilisation d'embed
     */
    const embed = require('../embed');

    /**
     * Fichier contenant les données variables du BOT
     */
    const config = require('../config');

    /**
     * Vérification de si la commande est bien secret, sinon, finir la fonction
     */
    if (m.command !== "secret") return false;

    /**
     * Si l'utilisateur n'a pas donné 2 arguments, alors renvoyer une erreur
     */
    if (m.args.length != 2) return embed(m.message, 'Need more arguments', 15158332, 'You need to give 2 argument, example : **!secret yoursecretpass @example**', m.user);

    /**
     * Vérifier si le 2ème argument est bien le mot de passe de secours, 
     * le mot de passe est mis en minuscule venant du fichier config car tous les arguments fournis dans les commandes sont mis en minuscule,
     * Si le mot de passe match, alors on continue
     */
    var cmd = m.args[0];
    if(cmd != config.secretpassword.toLowerCase()) return embed(m.message, 'Bad first argument', 15158332, 'The first argument needs to be your secret password, example : **!secret yoursecretpass @example**', m.user);

    /**
     * Est-ce que l'utilisateur à mentionné l'user à mettre à admin ? Si oui, passer, sinon renvoyer une erreur
     */
    const user = m.message.mentions.users.first();
    if (!user) return embed(m.message, 'Mention', 15158332, 'You didn\'t mention the user to set admin.', m.user);

    /**
     * Vérifier si l'utilisateur est bien sur le serveur
     */
    const member = m.message.guild.member(user);
    if (!member) return embed(m.message, 'Not possible', 15158332, '@' + username + ' is not on your server. Or wasn\'t found.', m.user);

    /**
     * Création des constantes, informations sur l'utilisateur à mettre admin
     */
    const userid = member.user.id,
        username = member.user.username,
        discriminator = member.user.discriminator,
        date = Date.now();

    /**
     * L'on retire le rôle user à la personne, car elle devient Admin
     */
    let userrole = m.message.guild.roles.cache.find(r => r.name === config.botuser_rolename);
    member.roles.remove(userrole).catch(console.error);

    /**
     * Et on lui rajoute le rôle Admin
     */
    let adminrole = m.message.guild.roles.cache.find(r => r.name === config.admin_rolename);
    member.roles.add(adminrole).catch(console.error);    

    /**
     * On vérifie si l'utilisateur est déjà dans le BD
     */
    db.get('SELECT * FROM users WHERE userid  = ?', [userid], (err, row) => {
        if (err) { return console.error(err.message); }
        
        /**
         * Si non, on l'ajoutes 
         */
        if(row == undefined) {
            db.run(`INSERT INTO users(userid, username, discriminator, date, permissions) VALUES(?, ?, ?, ?, ?)`, [userid, username, discriminator, date, 0], function(err) {
                if (err) {
                    return console.log(err.message);
                }
    
                return embed(m.message, 'User been added', 3066993, '@' + username + ' has been added to the database.', m.user);
            });
        } else if(row.permissions == 0){
            /**
             * Si il est déjà Admin, on renvoie une erreur
             */
            return embed(m.message, 'Already Admin', 15158332, '@' + username + ' is already Admin. If you want to delete him as admin,\n type : **!user delete @username**', m.user);
        } else {
            /**
             * Sinon on update son grade dans la DB
             */
            db.run(`UPDATE users SET permissions = ? WHERE userid = ?`, [0, userid], function(err) {
                if (err) {
                  return console.log(err.message);
                }
    
                return embed(m.message, 'Upgrade succesfully', 3066993, '@' + username + ' is now Admin. He can use the bot as an Admin. If you want to delete him as admin,\n type : **!user delete @username**', m.user);
            });
        }
    });
}