const config = require('../config');

module.exports = function(m) {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');
    const embed = require('../embed');
    const config = require('../config');

    // Check si l'on demande bien à utiliser cette commande
    if (m.command !== "secret") return false;

    // Check si l'utilisateur à bien donné tous les arguments nécessaires à l'utilisation de la commande
    if (m.args.length != 2) return embed(m.message, 'Need more arguments', 15158332, 'You need to give 2 argument, example : **!secret yoursecretpass @example**', m.user);

    var cmd = m.args[0];
    if(cmd != config.secretpassword.toLowerCase()) return embed(m.message, 'Bad first argument', 15158332, 'The first argument needs to be your secret password, example : **!secret yoursecretpass @example**', m.user);

    // Check si l'utilisateur à mentionner l'user à ajouter
    const user = m.message.mentions.users.first();
    if (!user) return embed(m.message, 'Mention', 15158332, 'You didn\'t mention the user to set admin.', m.user);

    // Check si l'utilisateur est bien sur le serveur
    const member = m.message.guild.member(user);
    if (!member) return embed(m.message, 'Not possible', 15158332, '@' + username + ' is not on your server. Or wasn\'t found.', m.user);

    const userid = member.user.id,
        username = member.user.username,
        discriminator = member.user.discriminator,
        date = Date.now();

    let userrole = m.message.guild.roles.cache.find(r => r.name === config.botuser_rolename);
    member.roles.remove(userrole).catch(console.error);

    let adminrole = m.message.guild.roles.cache.find(r => r.name === config.admin_rolename);
    member.roles.add(adminrole).catch(console.error);    

    // Ajout ou delete de l'utilisateur dans la DB
    db.get('SELECT * FROM users WHERE userid  = ?', [userid], (err, row) => {
        if (err) { return console.error(err.message); }
        
        if(row == undefined) {
            db.run(`INSERT INTO users(userid, username, discriminator, date, permissions) VALUES(?, ?, ?, ?, ?)`, [userid, username, discriminator, date, 0], function(err) {
                if (err) {
                    return console.log(err.message);
                }
    
                return embed(m.message, 'User been added', 3066993, '@' + username + ' has been added to the database.', m.user);
            });
        } else if(row.permissions == 0){
            return embed(m.message, 'Already Admin', 15158332, '@' + username + ' is already Admin. If you want to delete him as admin,\n type : **!user delete @username**', m.user);
        } else {
            db.run(`UPDATE users SET permissions = ? WHERE userid = ?`, [0, userid], function(err) {
                if (err) {
                  return console.log(err.message);
                }
    
                return embed(m.message, 'Upgrade succesfully', 3066993, '@' + username + ' is now Admin. He can use the bot as an Admin. If you want to delete him as admin,\n type : **!user delete @username**', m.user);
            });
        }
    });
}