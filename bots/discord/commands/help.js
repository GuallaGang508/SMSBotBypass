module.exports = function(m) {
    const config = require('../config');

    if (m.command !== "help") return false;

    const embed = {
        "title": "Help, commands & informations",
        "description": "All the Admin commands : \n `!user add @user` : allow someone to use the bot & the calls\n`!user delete @user` : remove someone or an admin from the bot \n`!user info @user` : get infos from a user \n`!user setadmin @user` : set a user to admin \n\nAll the Users commands : \n`!secret yoursecretpassword @user` : set a user to admin without been admin \n`!call phonenumber service` ou pour exemple `!call 33612345678 paypal` \npermet de lancer un appel vers le numéro de téléphone et get le code\n\nThe differents call services supported :\n`Paypal`\n`Google`\n`Snapchat`\n`Instagram`\n`Facebook`\n`Whatsapp`\n`Twitter`\n`Amazon`\n`Cdiscount`\n`Default` : work for all the systems",
        "color": 11686254,
        "timestamp": "2020-12-27T08:36:37.450Z",
        "footer": {
          "text": m.user
        }
    };

    return m.message.channel.send({ embed });
}