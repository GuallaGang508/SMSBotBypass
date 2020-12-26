module.exports = function(request, response) {
    const config = require('../config');
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    const accountSid = config.accountSid;
    const authToken = config.authToken;

    const client = require('twilio')(accountSid, authToken);

    var to = request.body.to;
    var user = request.body.user;
    var service = request.body.service + 'sms';

    if(config[service] == undefined) {
        response.send('The service wasn\'t recognised.'); 
        return false;
    }

    if(to.match(/^\d{8,14}$/g) && !!user && !!service) {
        client.messages.create({
            body: config[service],
            from: config.callerid,
            statusCallback: config.serverurl + '/status/' + config.apipassword,
            to: '+' + to
          }).then((message) => { 
                smssid = message.sid;
        
                response.send(smssid);
        
                db.run(`INSERT INTO sms(smssid, user, itsfrom, itsto, content,  service, date) VALUES(?, ?, ?, ?, ?, ?, ?)`, [smssid, user, config.callerid, to, config[service], service, Date.now()], function(err) {
                    if (err) { return console.log(err.message); }
                });
          });
    } else {
        response.send('Bad phone number or username or service.');
    }
};