const { response } = require('express');

module.exports = function(request, response) {
    var itsfrom = request.body.From;
    var itsto = request.body.To;
    var sid = request.body.CallSid;
    var table = null;
    var sidname = null;
    if(sid != undefined) {
        var status = request.body.CallStatus;
        table = 'calls';
        sidname = 'callSid';
    } else {
        sid = request.body.SmsSid;
        var status = request.body.SmsStatus;
        table = 'sms';
        sidname = 'smssid';
    }
    var date = Date.now();

    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    db.get('SELECT ' + sidname + ' text FROM ' + table + ' WHERE ' + sidname + ' = ?', [sid], (err, row) => {
        if (err) { return console.log(err.message); }
    
        if(row == undefined) { 
            db.run('INSERT INTO ' + table + '(itsfrom, itsto, status, ' + sidname + ', date) VALUES(?, ?, ?, ?, ?)', [itsfrom, itsto, status, sid, date], function(err) {
                if (err) { return console.log(err.message); }

                return response.send('Ok.');
              });
        } else {
            db.run('UPDATE ' + table + ' SET status = ?, itsfrom = ?, itsto = ?, date = ? WHERE ' + sidname + ' = ?', [status, itsfrom, itsto, date, sid], function(err) {
                if (err) { return console.log(err.message); }

                return response.send('Ok.');
            });
        }
    });
};
