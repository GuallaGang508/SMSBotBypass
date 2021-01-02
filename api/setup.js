module.exports = function(request, response) {
    /**
     * Intégration des dépendences SQLITE3
     */
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    /**
     * Dépendance permettant la modification du fichier config et la génération du mot de passe de l'api
     */
    const fs = require('fs');
    const generator = require('generate-password');

    /**
     * Création de la DB ainsi que les tables contenues dedans
     */
    db.serialize(function() {
        db.run('CREATE TABLE IF NOT EXISTS calls (itsfrom TEXT, itsto TEXT, digits TEXT, callSid TEXT, status TEXT, date TEXT, user TEXT, name TEXT, service TEXT)');
        db.run('CREATE TABLE IF NOT EXISTS sms (itsfrom TEXT, itsto TEXT, smssid TEXT, content TEXT, status TEXT, date TEXT, user TEXT, service TEXT)');
    });

    fs.readFile('config.js', 'utf-8', function(err, data) {
        if (err) throw err;

        var pass = generator.generate({
            length: 32,
            numbers: true
        });
        var newapipassword = data.replace(/passwordtochange/gim, pass);

        fs.writeFile('config.js', newapipassword, 'utf-8', function(err, data) {
            if (err) throw err;
            console.log('Setup the new api password : done.');

            fs.readFile('config.js', 'utf-8', function(err, data) {
                if (err) throw err;

                var setupdone = data.replace(/false/gim, 'true');

                fs.writeFile('config.js', setupdone, 'utf-8', function(err, data) {
                    if (err) throw err;
                    console.log('Automatic setup : done.');
                });
            });
        });
    });
};