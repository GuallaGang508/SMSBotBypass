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
     * Vérification de si la commande est bien user, sinon, finir la fonction
     */
    if (m.command !== "user") return false;

    /**
     * Si l'utilisateur n'a pas donné 2 arguments, alors renvoyer une erreur
     */
    if (m.args.length != 2) return embed(m.message, 'Need more arguments', 15158332, 'You need to give 2 argument, example : **!user add @example**', m.user);

    /**
     * Vérifier si le 2ème argument est bien l'un des arguments disponibles, 
     * Seulement add, delete, info et setadmin sont disponibles
     */
    var cmd = m.args[0];
    if(cmd != 'add' && cmd != 'delete' && cmd != 'info' && cmd != 'setadmin') return embed(m.message, 'Bad first argument', 15158332, 'The first argument needs to be add/delete/info/setadmin, example : **!user add @example**', m.user);

    /**
     * Est-ce que l'utilisateur à mentionné l'user à mettre à admin ? Si oui, passer, sinon renvoyer une erreur
     */
    const user = m.message.mentions.users.first();
    if (!user) return embed(m.message, 'Mention', 15158332, 'You didn\'t mentionned the user, example : **!user add @user**', m.user);

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
    db.get('SELECT userid FROM users WHERE userid = ?', [userid], (err, row) => {
        if (err) {
            return console.error(err.message);
        }

        /**
         * L'on met un switch pour prendre au cas par cas la fonction à utiliser
         */
        switch(cmd) {
            case 'add':
                    /**
                     * On vérifie si l'utilisateur n'est pas déjà dans la DB, si oui, on envoie une erreur
                     */
                    if (row != undefined) return embed(m.message, 'Already user', 15158332, 'You can\'t add someone in your database if he\'s already in.', m.user);

                    /**
                     * On ajoute le role d'utilisateur à la personne si elle a été ajoutée à la DB
                     */
                    let addrole = m.message.guild.roles.cache.find(r => r.name === config.botuser_rolename);
                        member.roles.add(addrole).catch(console.error);

                    /**
                     * On l'insert dans la DB
                     */
                    db.run(`INSERT INTO users(userid, username, discriminator, date, permissions) VALUES(?, ?, ?, ?, ?)`, [userid, username, discriminator, date, 1], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
            
                        return embed(m.message, 'User been added', 3066993, '@' + username + ' has been added to the database.', m.user);
                    });
                break;
            case 'delete':
                    /**
                     * On vérifie si l'utilsateur n'est pas dans la db, si il n'est pas dedans, on peut pas le delete
                     */
                    if (row == undefined) return embed(m.message, 'Already delete', 15158332, 'You can\'t delete someone from your database if he\'s not in.', m.user);

                    /**
                     * On lui enlève le rôle d'utilisateur
                     */
                    let deleterole = m.message.guild.roles.cache.find(r => r.name === config.botuser_rolename);
                        member.roles.remove(deleterole).catch(console.error);
                    
                    /**
                     * On lui enlève le rôle d'admin
                     */
                    let deleteadminrole = m.message.guild.roles.cache.find(r => r.name === config.admin_rolename);
                        member.roles.remove(deleteadminrole).catch(console.error);

                    /**
                     * On le supprime de la DB
                     */
                    db.run(`DELETE FROM users WHERE userid = ?`, [userid], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
            
                        return embed(m.message, 'User been deleted', 3066993, '@' + username + ' has been deleted from the database.', m.user);
                    });
                break;
            case 'info':
                    /**
                     * On récupère dans la DB les infos de l'utilisateur
                     */
                    db.get('SELECT * FROM users WHERE userid  = ?', [userid], (err, row) => {
                        if (err) { return console.error(err.message); }
        
                        /**
                         * Si il est pas en db, on l'annonce
                         */
                        if(row == undefined) return embed(m.message, 'No information', 15158332, '@' + username + ' is not in the database. He can\'t use the bot or any command.', m.user);
        
                        /**
                         * On définie son grade et le retourne en embed
                         */
                        rank = row.permissions == 0 ? 'admin' : 'a normal user';
                        return embed(m.message, 'Informations about ' + username, 3066993, '@' + username + ' is **' + rank +  '**. He can use the bot.', m.user);
                    });
                break;
            case 'setadmin':
                    /**
                     * On vérifie en DB le grade de l'utilsateur
                     */
                    db.get('SELECT * FROM users WHERE userid  = ?', [userid], (err, row) => {
                        if (err) { return console.error(err.message); }

                        /**
                         * On lui enlève le rôle utilisateur
                         */
                        let userrole = m.message.guild.roles.cache.find(r => r.name === config.botuser_rolename);
                        member.roles.remove(userrole).catch(console.error);

                        /**
                         * On lui ajoute le grade Admin
                         */
                        let adminrole = m.message.guild.roles.cache.find(r => r.name === config.admin_rolename);
                        member.roles.add(adminrole).catch(console.error);

                        /**
                         * Si il n'est pas en DB, on l'ajoute
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
                             * Si il est déjà Admin, on emet une erreur
                             */
                            return embed(m.message, 'Already Admin', 15158332, '@' + username + ' is already Admin. If you want to delete him as admin,\n type : **!user delete @username**', m.user);
                        } else {
                            /**
                             * Et dans le dernier cas l'on met seulement à jour son grade 
                             */
                            db.run(`UPDATE users SET permissions = ? WHERE userid = ?`, [0, userid], function(err) {
                                if (err) {
                                  return console.log(err.message);
                                }
    
                                return embed(m.message, 'Upgrade succesfully', 3066993, '@' + username + ' is now Admin. He can use the bot as an Admin. If you want to delete him as admin,\n type : **!user delete @username**', m.user);
                            });
                        }
                    });
                break;
            default:
                break;
        }
    });
}