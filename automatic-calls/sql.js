const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/data.db')

db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS calls (itsfrom TEXT, itsto TEXT, digits TEXT, callSid TEXT, status TEXT, date TEXT, user TEXT, service TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS sms (itsfrom TEXT, itsto TEXT, smssid TEXT, content TEXT, status TEXT, date TEXT, user TEXT, service TEXT)');

   db.all('SELECT ITSFROM, ITSTO, DIGITS, CALLSID, STATUS, DATE, USER, SERVICE FROM calls', function (err, row) {
     if (err) {
        console.log(err)
     } else {
            if (row.length === 0) {
            var stmt = db.prepare('INSERT INTO calls VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

            var obj = [{ 
                            itsfrom: '33123456789', 
                            itsto: '33123456789',
                            digits: '123456',
                            callSid: 'CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                            status: 'completed',
                            date: '01/01/2001',
                            user: 'admin',
                            service: 'paypal'
                        }];

            for (var i in obj) {
                stmt.run(obj[i].itsfrom, obj[i].itsto, obj[i].digits, obj[i].callSid, obj[i].status, obj[i].date, obj[i].user, obj[i].service);
            }

            stmt.finalize()
       } else {
            console.log('Database already exists');
       }

       
     }
  });

  db.all('SELECT ITSFROM, ITSTO, SMSSID, CONTENT, STATUS, DATE, USER, SERVICE FROM sms', function (err, row) {
    if (err) {
       console.log(err)
    } else {
           if (row.length === 0) {
           var stmt = db.prepare('INSERT INTO sms VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

           var obj = [{ 
                           itsfrom: '33123456789', 
                           itsto: '33123456789',
                           smssid: 'SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                           content: 'Voici un SMS.',
                           status: 'completed',
                           date: '01/01/2001',
                           user: 'admin',
                           service: 'paypal'
                       }];

           for (var i in obj) {
               stmt.run(obj[i].itsfrom, obj[i].itsto, obj[i].smssid, obj[i].content, obj[i].status, obj[i].date, obj[i].user, obj[i].service);
           }

           stmt.finalize()
      } else {
           console.log('Database already exists');
      }
    }
 });
});


/*
db.all('SELECT ITSFROM, ITSTO, DIGITS, CALLSID, STATUS, DATE, USER, SERVICE FROM calls', function (err, rows) {
    var output = []
    if (err) {
      console.log(err)
    } else {
      if (rows.length === 0) {
        console.log('Empty database');
      } else {
        rows.forEach(function (row) {
          output.push({ 
            itsfrom: row.itsfrom, 
            itsto: row.itsto,
            digits: row.digits,
            callSid: row.callSid,
            status: row.status,
            date: row.date,
            user: row.user,
            service: row.service
            })
        })
        console.log(output)
      }
    }
  });
*/
  
