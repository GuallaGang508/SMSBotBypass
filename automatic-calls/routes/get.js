module.exports = function(request, response) {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    var callSid = request.body.callSid;

    db.get('SELECT callSid text FROM calls WHERE callSid = ?', [callSid], (err, row) => {
        if (err) { return console.log(err.message); }
    
        if(row == undefined) { 
            response.status(200).json({
                error: 'Invalid callSid'
              });
        } else {
            db.get('SELECT * FROM calls WHERE callSid  = ?', [callSid], (err, row) => {
                if (err) { return console.error(err.message); }

                response.status(401).json({
                    itsto: row.itsto,
                    digits: row.digits,
                    satus: row.status,
                    date: row.date,
                    marine: row.user
                  });
            });
        }
    });
};
