const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/data.db')

db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS users (userid TEXT, username TEXT, discriminator TEXT, date TEXT, permissions TEXT)');

   db.all('SELECT USERID, USERNAME, DISCRIMINATOR, DATE, PERMISSIONS FROM users', function (err, row) {
     if (err) {
        console.log(err)
     } else {
            if (row.length === 0) {
            var stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?)');

            var obj = [{
                            userid: '123451234512345123', 
                            username: 'marine',
                            discriminator: '1234',
                            date: '01/01/2001',
                            permissions: '0'
                      }];

            for (var i in obj) {
                stmt.run(obj[i].userid, obj[i].username, obj[i].discriminator, obj[i].date, obj[i].permissions);
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
  
