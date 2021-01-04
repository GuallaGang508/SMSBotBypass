process.env.NODE_ENV = 'test';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/data.db');

const config = require('../config');

let server = require('../app');
let chai = require('chai');
let chaiHttp = require('chai-http');
const {
    expect
} = require('chai');

let should = chai.should();

chai.use(chaiHttp);

describe('Voice.js', () => {
    beforeEach((done) => { //Before each test we empty the database
        db.run(`DELETE FROM calls WHERE 1`, function(err) {
            if (err) return console.log(err.message);
        });

        db.run(`INSERT INTO calls(itsfrom, itsto, callSid, digits, status,  date, user, service) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, ['33123456789', '33123456789', 'fakecallsid', '123456', 'test', 'testdate', 'test', 'paypal'], function(err) {
            if (err) {
                return console.log(err.message);
            }

            db.run(`INSERT INTO calls(itsfrom, itsto, callSid, digits, status,  date, user) VALUES(?, ?, ?, ?, ?, ?, ?)`, ['33123456789', '33123456789', 'fakecallsid2', '123456', 'test', 'testdate', 'test'], function(err) {
                if (err) {
                    return console.log(err.message);
                }

                db.run(`INSERT INTO calls(itsfrom, itsto, callSid, digits, status,  date, user, service) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, ['33123456789', '33123456789', 'fakecallsid3', '123456', 'test', 'testdate', 'test', 'fakeservice'], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                    done();
                });
            });
        });
    });

    /*
     * Test the /GET route
     */
    describe('/voice POST', () => {
        it('it should return an ERROR "Please give us the callSid." : we are not sending any callSid', (done) => {
            chai.request(server)
                .post('/voice/' + config.apipassword)
                .set('content-type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.have.property('error').eql('Please give us the callSid.');

                    done();
                });
        });

        it('it should return the twiML code for the paypal service : we are not sending any callSid or digit', (done) => {
            chai.request(server)
                .post('/voice/' + config.apipassword)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    CallSid: 'fakecallsid'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.have.header('content-type', 'text/xml; charset=utf-8');
                    res.text.should.equal('<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="8" numDigits="6"><Say>Bonjour ,</Say><Play loop="4">' + config.serverurl + '/stream/paypal</Play></Gather></Response>');

                    done();
                });
        });

        it('it should return the twiML code for the default service : the service is not precised in the db', (done) => {
            chai.request(server)
                .post('/voice/' + config.apipassword)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    CallSid: 'fakecallsid2'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.have.header('content-type', 'text/xml; charset=utf-8');
                    res.text.should.equal('<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="8" numDigits="6"><Say>Bonjour ,</Say><Play loop="4">' + config.serverurl + '/stream/default' + '</Play></Gather></Response>');

                    done();
                });
        });

        it('it should return the twiML code for the default service : the service asked doesn\'t exist', (done) => {
            chai.request(server)
                .post('/voice/' + config.apipassword)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    CallSid: 'fakecallsid3'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.have.header('content-type', 'text/xml; charset=utf-8');
                    res.text.should.equal('<?xml version="1.0" encoding="UTF-8"?><Response><Gather timeout="8" numDigits="6"><Say>Bonjour ,</Say><Play loop="4">' + config.serverurl + '/stream/default' + '</Play></Gather></Response>');

                    done();
                });
        });

        it('it should return the twiML code for the end service : we provided the 6 digits code', (done) => {
            chai.request(server)
                .post('/voice/' + config.apipassword)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    CallSid: 'fakecallsid3',
                    Digits: '123456'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.have.header('content-type', 'text/xml; charset=utf-8');
                    res.text.should.equal('<?xml version="1.0" encoding="UTF-8"?><Response><Play>' + config.serverurl + '/stream/end</Play></Response>');

                    done();
                });
        });
    });
});