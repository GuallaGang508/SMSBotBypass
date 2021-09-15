module.exports = function(request, response) {
    /**
     * Intégration des dépendences SQLITE3
     */
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    /**
     * Fichier contenant les configurations nécéssaires au bon fonctionnement du système
     */
    const config = require('../config');

    /**
     * Identification et déclaration Twilio
     */
    const client = require('twilio')(config.accountSid, config.authToken);

    /**
     * Récupération des variables postées permettant d'ordonner l'appel
     */
    var to = request.body.to || null;
    var user = request.body.user || null;
    var service = request.body.service || null;
    var name = request.body.name || null;
    var callSid = null;

    /**
     * Si il manque l'une des variable, transmettre l'erreur et empêcher le fonctionnement du système
     */
    if (to == null || user == null || service == null) {
        return response.status(200).json({
            error: 'Please post all the informations needed.'
        });
    }

    /**
     * Si l'on ne trouve pas l'emplacement du fichier service, alors cela veut dire que le service n'est pas supporté et l'on retourne une erreur 
     */
    if (config[service + 'filepath'] == undefined) {
        return response.status(200).json({
            error: "The service wasn't recognised."
        });
    }

    if (!!!user) {
        return response.status(200).json({
            error: "Bad user name."
        });
    }

    if (!!!service) {
        return response.status(200).json({
            error: "Bad service name."
        });
    }

    /**
     * Si le numéro de téléphone est correcte, alors on lance l'appel
     */
    if (!to.match(/^\d{8,14}$/g)) {
        return response.status(200).json({
            error: 'Bad phone number.'
        });
    }

    /**
     * API Twilio permettant d'émettre l'appel
     */
    client.calls.create({
        method: 'POST',
        statusCallbackEvent: ['initiated', 'answered', 'completed'],
        statusCallback: config.serverurl + '/status/' + config.apipassword,
        url: config.serverurl + '/voice/' + config.apipassword,
        to: to,
        from: config.callerid
    }).then((call) => {
        callSid = call.sid;

        /**
         * Ajout à la DB Sqlite3 de l'appel lancé
         */
        db.get('SELECT callSid FROM calls WHERE callSid = ?', [callSid], (err, row) => {
            if (err) {
                return console.log(err.message);
            }

            /**
             * Si l'appel n'a pas déjà été enregistré, (vérification au niveau callSid => identificateur unique d'appel), alors l'enregistrer
             */
            if (row == undefined) {
                db.run(`INSERT INTO calls(callSid, user, service, itsto, name) VALUES(?, ?, ?, ?, ?)`, [callSid, user, service, to, name], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });
            } else {
                db.run(`UPDATE calls SET user = ?, service = ?, itsto = ?, name = ?  WHERE callSid = ?`, [user, service, to, callSid, name], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                });
            }
        });

        response.status(200).json({
            callSid
        });
    }).catch(error => {
        return response.status(200).json({
            error: 'There was a problem with your call, check if your account is upgraded. ' + error
        });
    });

};
