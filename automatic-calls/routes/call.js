module.exports = function(request, response) {
    const config = require('../config');
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    const accountSid = config.accountSid;
    const authToken = config.authToken;

    const client = require('twilio')(accountSid, authToken);

    var to = request.body.to || null;
    var user = request.body.user || null;
    var service = request.body.service || null;
    var callSid = null;

    if(to == null || user == null || service == null) { 
        response.send('Please post all the informations needed.'); 
        return false; 
    }

    if(config[service + 'filepath'] == undefined) {
        response.send('The service wasn\'t recognised.'); 
        return false;
    }
    
    if(to.match(/^\d{8,14}$/g) && !!user && !!service) {
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
    
            db.get('SELECT callSid text FROM calls WHERE callSid = ?', [callSid], (err, row) => {
                if (err) { return console.log(err.message); }
                
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
