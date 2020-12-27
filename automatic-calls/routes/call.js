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
    var callSid = null;

    /**
     * Si il manque l'une des variable, transmettre l'erreur et empêcher le fonctionnement du système
     */
    if(to == null || user == null || service == null) { 
        response.send('Please post all the informations needed.'); 
        return false; 
    }

    /**
     * Si l'on ne trouve pas l'emplacement du fichier service, alors cela veut dire que le service n'est pas supporté et l'on retourne une erreur 
     */
    if(config[service + 'filepath'] == undefined) {
        response.send('The service wasn\'t recognised.'); 
        return false;
    }
    
    /**
     * Si le numéro de téléphone est correcte, alors on lance l'appel
     */
    if(to.match(/^\d{8,14}$/g) && !!user && !!service) {
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
    
            response.send(callSid);
    
            /**
             * Ajout à la DB Sqlite3 de l'appel lancé
             */
            db.get('SELECT callSid text FROM calls WHERE callSid = ?', [callSid], (err, row) => {
                if (err) { return console.log(err.message); }
                
                /**
                 * Si l'appel n'a pas déjà été enregistré, (vérification au niveau callSid => identificateur unique d'appel), alors l'enregistrer
                 */
                if(row == undefined) { 
                    db.run(`INSERT INTO calls(callSid, user, service) VALUES(?, ?, ?)`, [callSid, user, service], function(err) {
                            if (err) { return console.log(err.message); }
                        });
                } else {
                        db.run(`UPDATE calls SET user = ?, service = ?  WHERE callSid = ?`, [user, service, callSid], function(err) {
                            if (err) { return console.log(err.message); }
                        });
                    }
            });
        });
    } else {
        response.send('Bad phone number or username or service.');
    }
};
