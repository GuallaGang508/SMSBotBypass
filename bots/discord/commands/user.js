module.exports = function(m) {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');
    const embed = require('../embed');

    // Check si l'on demande bien à utiliser cette commande
    if (m.command !== "user") return false;

    // Check si l'utilisateur à bien donné tous les arguments nécessaires à l'utilisation de la commande
    if (m.args.length != 2) return embed(m.message, 'Need more arguments', 15158332, 'You need to give 2 argument, example : **!user add @example**', m.user);

    if(m.args[0] != 'add' && m.args[0] != 'delete') return embed(m.message, 'Bad first argument', 15158332, 'The first argument needs to be add or delete, example : **!user add @example**', m.user);

    // Check si l'utilisateur à mentionner l'user à ajouter
    const user = m.message.mentions.users.first();
    if (!user) return embed(m.message, 'Mention', 15158332, 'You didn\'t mention the user to add.', m.user);

    // Check si l'utilisateur est bien sur le serveur
    const member = m.message.guild.member(user);
    if (!member) return embed(m.message, 'Not possible', 15158332, '@' + username + ' is not on your server. Or wasn\'t found.', m.user);

    const userid = member.user.id,
        username = member.user.username,
        discriminator = member.user.discriminator,
        date = Date.now();

    // Ajout ou delete de l'utilisateur dans la DB
    db.get('SELECT userid FROM users WHERE userid = ?', [userid], (err, row) => {
        if (err) {
            return console.error(err.message);
        }

        if(m.args[0] == 'add') {
            if (row != undefined) return embed(m.message, 'Already user', 15158332, 'You can\'t add someone in your database if he\'s already in.', m.user);

            db.run(`INSERT INTO users(userid, username, discriminator, date, permissions) VALUES(?, ?, ?, ?, ?)`, [userid, username, discriminator, date, 1], function(err) {
                if (err) {
                    return console.log(err.message);
                }
    
                return embed(m.message, 'User been added', 3066993, '@' + username + ' has been added to the database.', m.user);
            });
   
        } else {
            if (row == undefined) return embed(m.message, 'Already delete', 15158332, 'You can\'t delete someone from your database if he\'s not in.', m.user);

            db.run(`DELETE FROM users WHERE userid = ?`, [userid], function(err) {
                if (err) {
                    return console.log(err.message);
                }
    
                return embed(m.message, 'User been deleted', 3066993, '@' + username + ' has been deleted from the database.', m.user);
            });
        }
    });
}