module.exports = function(request) {
    var itsfrom = request.body.From;
    var itsto = request.body.To;
    var status = request.body.CallStatus;
    var callSid = request.body.CallSid;
    var date = Date.now();

    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    db.get('SELECT callSid text FROM calls WHERE callSid = ?', [callSid], (err, row) => {
        if (err) { return console.log(err.message); }
    
        if(row == undefined) { 
            db.run(`INSERT INTO calls(itsfrom, itsto, status, callSid, date) VALUES(?, ?, ?, ?, ?)`, [itsfrom, itsto, status, callSid, date], function(err) {
                if (err) { return console.log(err.message); }
              });
        } else {
            db.run(`UPDATE calls SET status = ?, itsfrom = ?, itsto = ?, date = ? WHERE callSid = ?`, [status, itsfrom, itsto, date, callSid], function(err) {
                if (err) { return console.log(err.message); }
            });
        }
    });
};
