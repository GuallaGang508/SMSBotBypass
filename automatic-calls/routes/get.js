module.exports = function(request, response) {
    /**
     * Intégration des dépendences SQLITE3
     */
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    var callSid = request.body.callSid;

    /**
     * Commande GET à la DB pour récupérer les informations sur un appel passé, 
     * utilisation du callSid.
     */
    db.get('SELECT callSid FROM calls WHERE callSid = ?', [callSid], (err, row) => {
        if (err) {
            return console.log(err.message);
        }

        if (row == undefined) {
            /**
             * Si l'appel n'est pas trouvé en db, retour d'erreur
             */
            response.status(200).json({
                error: 'Invalid callSid.'
            });
        } else {
            /**
             * Sinon prendre les infos en DB et les retourner
             */
            db.get('SELECT * FROM calls WHERE callSid  = ?', [callSid], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }

                /**
                 * Retour des infos sous format JSON pour que ce soit plus pratique
                 */
                response.status(200).json({
                    itsto: row.itsto,
                    itsfrom: row.itsfrom,
                    callSid: row.callSid,
                    digits: row.digits,
                    status: row.status,
                    date: row.date,
                    user: row.user,
                    service: row.service
                });
            });
        }
    });
};